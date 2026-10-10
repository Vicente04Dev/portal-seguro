/* Colégio Portal Seguro: comportamento comum do site (sem dependências) */
(function(){
  'use strict';
  var D=window.PS_DATA||{};
  function $(s,c){return (c||document).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function store(k,v){try{if(v===undefined)return JSON.parse(sessionStorage.getItem(k));sessionStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}

  /* ---------- menu móvel ---------- */
  var mb=$('#menuBtn'), nav=$('#nav');
  if(mb&&nav){
    function fecha(){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}
    mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
    $$('#nav a').forEach(function(a){a.addEventListener('click',fecha)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')fecha()});
    window.addEventListener('resize',function(){if(window.innerWidth>900)fecha()});
  }

  /* ---------- hero: alternância lenta das duas fotografias ---------- */
  var sl=$$('.slide'), si=0;
  if(sl.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    setInterval(function(){sl[si].classList.remove('on');si=(si+1)%sl.length;sl[si].classList.add('on')},9000);
  }

  /* ---------- níveis (lista de oferta) ---------- */
  $$('[data-niveis]').forEach(function(box){
    box.innerHTML=(D.niveis||[]).map(function(l){
      var href='contactos.html?assunto=classes&nivel='+encodeURIComponent(l.n+' ('+l.i+')');
      return '<div class="nivel"><h3>'+esc(l.n)+'</h3><span class="idade">'+esc(l.i)+'</span><p>'+esc(l.d)+'</p><a class="btn btn-ink" href="'+href+'" aria-label="Perguntar sobre '+esc(l.n)+'">Perguntar</a></div>';
    }).join('');
  });

  /* ---------- listas dos formulários ---------- */
  function opts(sel,list,ph){if(sel)sel.innerHTML=(ph?'<option value="">'+ph+'</option>':'')+list.map(function(x){return '<option>'+esc(x)+'</option>'}).join('')}
  var cls=$('#classe');
  if(cls)cls.innerHTML='<option value="">Seleccionar</option>'+(D.classes||[]).map(function(g){return '<optgroup label="'+esc(g[0])+'">'+g[1].map(function(x){return '<option>'+esc(x)+'</option>'}).join('')+'</optgroup>'}).join('');
  opts($('#ano'),D.anos||[],'Seleccionar'); opts($('#par'),D.parentesco||[],'Seleccionar'); opts($('#p2'),D.parentesco||[],'Seleccionar');
  opts($('#nac'),D.nacionalidades||[]); opts($('#cs'),D.assuntos||[]);

  /* ---------- validação ---------- */
  function phoneOk(v){var d=v.replace(/[\s.\-()]/g,'').replace(/^\+?244/,'');return /^9\d{8}$/.test(d)}
  function mark(el,ok){
    var f=el.closest('.f');if(!f)return ok;
    f.classList.toggle('bad',!ok);el.setAttribute('aria-invalid',!ok);
    var e=$('.err',f);if(e){if(!e.id)e.id='e-'+el.id;if(!ok)el.setAttribute('aria-describedby',e.id);else el.removeAttribute('aria-describedby')}
    return ok;
  }
  function check(el){
    var v=(el.value||'').trim();
    if(el.type==='tel')return mark(el,(el.required||v)?phoneOk(v):true);
    if(el.type==='email')return mark(el,!v||/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));
    if(el.id==='nasc'){var ok=!!v&&new Date(v)<=new Date()&&new Date(v).getFullYear()>1990;return mark(el,ok)}
    if(el.required)return mark(el,!!v);
    return true;
  }
  $$('form input,form select,form textarea').forEach(function(el){el.addEventListener('blur',function(){if(el.type!=='checkbox'&&el.type!=='radio')check(el)})});
  function radio(n){var r=$('input[name='+n+']:checked');return r?r.value:''}
  function primeiro(n){return (n||'').trim().split(/\s+/)[0]||''}
  function referencia(){return 'PS-'+new Date().getFullYear()+'-'+String(Math.floor(10000+Math.random()*89999))}
  /* envio de teste: mostra "a enviar", guarda o resumo só neste separador e abre a página de obrigado */
  function enviar(btn,dados,tipo){
    if(btn.getAttribute('data-sending'))return;
    btn.setAttribute('data-sending','1');btn.disabled=true;btn.innerHTML='<span class="spin" aria-hidden="true"></span>A enviar…';
    var ref=referencia();dados.ref=ref;dados.tipo=tipo;store('ps_envio',dados);
    setTimeout(function(){window.location.href='obrigado.html?tipo='+tipo+'&ref='+encodeURIComponent(ref)},900);
  }

  /* ---------- ficha de pré-inscrição por passos ---------- */
  var pre=$('#pre');
  if(pre){
    var fs=$$('#pre fieldset'), steps=$$('.steps li'), cur=0, next=$('#next'), prev=$('#prev'),
        nomes=['Dados do aluno','Encarregado de educação','Segundo responsável','Confirmar'];
    function resumo(){
      var rows=[['Aluno',$('#aluno').value],['Nascimento',$('#nasc').value?$('#nasc').value.split('-').reverse().join('/'):''],['Classe',$('#classe').value],['Ano lectivo',$('#ano').value],
        ['Encarregado',$('#enc').value+($('#par').value?' ('+$('#par').value+')':'')],['Telefone',$('#tel').value],['Contacto preferido',radio('canal')]];
      if($('#add2').checked&&$('#n2').value)rows.push(['2.º responsável',$('#n2').value+($('#t2').value?' · '+$('#t2').value:'')]);
      $('#resumo').innerHTML=rows.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1]||'—')+'</dd></div>'}).join('');
      return rows;
    }
    function show(n){
      cur=n;fs.forEach(function(f,k){f.classList.toggle('show',k===n)});
      steps.forEach(function(s,k){s.className=k<n?'ok':(k===n?'on':'');$('b',s).textContent=k<n?'✓':(k+1)});
      $('#passo').textContent='Passo '+(n+1)+' de 4: '+nomes[n];
      prev.hidden=n===0;next.textContent=n===3?'Enviar pré-inscrição':'Continuar';
      if(n===3)resumo();
    }
    show(0);
    $('#add2').addEventListener('change',function(){$('#seg').hidden=!this.checked});
    prev.addEventListener('click',function(){show(cur-1);pre.scrollIntoView({block:'start'})});
    next.addEventListener('click',function(){
      var ok=true;
      $$('input,select,textarea',fs[cur]).forEach(function(el){
        if(el.type==='checkbox'||el.type==='radio')return;
        if(cur===2&&el.id==='t2'&&!el.value)return;
        if(!check(el))ok=false;
      });
      if(!ok){var b=$('.bad input,.bad select,.bad textarea',fs[cur]);if(b)b.focus();return}
      if(cur<3){show(cur+1);pre.scrollIntoView({block:'start'});return}
      if(!$('#ok').checked){$('#okerr').style.display='block';$('#ok').focus();return}
      $('#okerr').style.display='none';
      var rows=resumo();
      enviar(next,{nome:primeiro($('#enc').value),aluno:primeiro($('#aluno').value),resumo:rows},'pre-inscricao');
    });
    $('#fill').addEventListener('click',function(){
      $('#aluno').value='Ana Beatriz Fernandes';$('#nasc').value='2020-05-14';$('input[name=sexo][value=Feminino]').checked=true;
      $('#classe').value='Jardim de Infância (4 anos)';$('#ano').value='2027/2028';$('#escola').value='Infantário Pequenos Passos';
      $('#enc').value='Maria da Conceição Fernandes';$('#par').value='Mãe';$('#nac').value='Angolana';$('#tel').value='923 456 789';$('#mail').value='maria.fernandes@exemplo.com';
      $('input[name=canal][value=WhatsApp]').checked=true;$('#add2').checked=true;$('#seg').hidden=false;
      $('#n2').value='Paulo Jorge Fernandes';$('#p2').value='Pai';$('#t2').value='931 234 567';
      $$('#pre .f.bad').forEach(function(f){f.classList.remove('bad')});
    });
  }

  /* ---------- formulário de pedido de informações ---------- */
  var info=$('#info');
  if(info){
    var q=new URLSearchParams(window.location.search);
    if(q.get('assunto')==='classes'){$('#cs').value='Informações sobre classes';if(q.get('nivel'))$('#cm').value='Gostaria de saber mais sobre: '+q.get('nivel').slice(0,120)+'.'}
    $('#send').addEventListener('click',function(){
      var ok=true;$$('#info input,#info textarea').forEach(function(el){if(!check(el))ok=false});
      if(!ok){var b=$('#info .bad input,#info .bad textarea');if(b)b.focus();return}
      enviar($('#send'),{nome:primeiro($('#cn').value),resumo:[['Nome',$('#cn').value],['Telefone',$('#ct').value],['Assunto',$('#cs').value],['Mensagem',$('#cm').value]]},'contacto');
    });
    $('#fill2').addEventListener('click',function(){
      $('#cn').value='Maria Fernandes';$('#ct').value='923 456 789';$('#cs').value='Visita ao colégio';
      $('#cm').value='Gostaria de visitar o colégio e conhecer as salas. Que dias são possíveis?';
      $$('#info .f.bad').forEach(function(f){f.classList.remove('bad')});
    });
  }

  /* ---------- página de obrigado ---------- */
  var ty=$('#ty');
  if(ty){
    var p=new URLSearchParams(window.location.search), tipo=p.get('tipo')==='contacto'?'contacto':'pre-inscricao';
    var d=store('ps_envio'), ok=d&&d.tipo===tipo;
    var refTxt=(p.get('ref')||'').replace(/[^A-Za-z0-9\-]/g,'').slice(0,20);
    $('#ty-titulo').textContent='Obrigado'+(ok&&d.nome?', '+d.nome:'')+'.';
    $('#ty-texto').textContent=tipo==='contacto'
      ?'Recebemos a sua mensagem. A secretaria responde pelo telefone que indicou.'
      :'Recebemos a pré-inscrição'+(ok&&d.aluno?' de '+d.aluno:'')+'. A secretaria contacta o encarregado de educação pelo canal indicado.';
    if(refTxt){$('#ty-ref').hidden=false;$('#ty-ref-n').textContent=refTxt}
    if(ok&&d.resumo){
      $('#ty-resumo').innerHTML=d.resumo.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1]||'—')+'</dd></div>'}).join('');
      $('#ty-resumo').hidden=false;
    }
    if(!ok){$('#ty-texto').textContent='Esta é a página que o encarregado vê depois de enviar um formulário. Experimente preencher a ficha de pré-inscrição ou o pedido de informações.'}
    $('#ty-voltar').href=tipo==='contacto'?'contactos.html':'pre-inscricao.html';
    $('#ty-voltar').textContent=tipo==='contacto'?'Fazer outra pergunta':'Fazer outra pré-inscrição';
  }
})();
