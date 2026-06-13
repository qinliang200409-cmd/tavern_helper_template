import { createScriptIdDiv, reloadOnChatChange, teleportStyle } from '@util/script';

const CSS = `
.st-bar{font-family:'Noto Sans SC','Microsoft YaHei',sans-serif;font-size:12px;color:#FFF8EC;background:linear-gradient(160deg,rgba(26,26,46,0.95),rgba(22,33,62,0.92));border:1px solid rgba(212,163,115,0.2);border-radius:8px;padding:10px 14px;max-width:360px;line-height:1.4;margin:4px auto}
.st-bar .hdr{display:flex;justify-content:space-between;padding-bottom:8px;border-bottom:1px solid rgba(212,163,115,0.15);margin-bottom:8px}
.st-bar .ttl{font-family:'Noto Serif SC',serif;font-size:14px;font-weight:600;color:#E6B87D;letter-spacing:1px}
.st-bar .sub{font-size:11px;color:#A89680}
.st-bar .rw{display:flex;align-items:center;gap:8px;padding:4px 0}
.st-bar .lb{font-size:11px;color:#A89680;min-width:48px}
.st-bar .vl{font-size:11px;font-weight:500;color:#FFF8EC;min-width:22px;text-align:right}
.st-bar .tr{flex:1;height:5px;background:rgba(255,248,236,0.08);border-radius:3px;overflow:hidden}
.st-bar .fl{height:100%;border-radius:3px}
.st-bar .warm{background:linear-gradient(90deg,#D4A373,#E8807A)}
.st-bar .cold{background:linear-gradient(90deg,#7FB5C8,#4A8BA8)}
.st-bar .hot{background:linear-gradient(90deg,#C96A65,#E8807A)}
.st-bar .bdg{display:inline-flex;padding:1px 8px;border-radius:10px;font-size:11px;font-weight:500}
.st-bar .sd{background:rgba(127,181,200,0.2);color:#7FB5C8;border:1px solid rgba(127,181,200,0.3)}
.st-bar .sa{background:rgba(230,184,125,0.2);color:#E6B87D;border:1px solid rgba(230,184,125,0.3)}
.st-bar .si{background:rgba(232,128,122,0.2);color:#E8807A;border:1px solid rgba(232,128,122,0.3)}
.st-bar .sc{background:rgba(160,90,160,0.2);color:#C084C0;border:1px solid rgba(160,90,160,0.3)}
.st-bar .tag{padding:1px 8px;border-radius:4px;font-size:11px;background:rgba(212,163,115,0.12);border:1px solid rgba(212,163,115,0.15);color:#D4A373}
`;

function stageClass(s: string): string {
  const m: Record<string,string> = { '日常':'sd','暧昧':'sa','沉沦':'si','矛盾':'sc' };
  return 'bdg ' + (m[s] || 'sd');
}

function bar(cls: string, v: any): string {
  const p = Math.max(0, Math.min(100, Number(v) || 0));
  return `<div class="tr"><div class="fl ${cls}" style="width:${p}%"></div></div>`;
}

function render(d: any): string {
  const c = d?.千夏 || {};
  return `<div class="hdr"><span class="ttl">千夏</span><span class="sub">${d?.系统?.当前时间||'--'} · ${d?.系统?.当前场景||'--'}</span></div>
<div class="rw"><span class="lb">阶段</span><span class="${stageClass(c.亲密阶段)}">${c.亲密阶段||'--'}</span></div>
<div class="rw"><span class="lb">亲密度</span>${bar('warm',c.亲密度)}<span class="vl">${c.亲密度??'--'}</span></div>
<div class="rw"><span class="lb">穿着</span><span class="tag">${c.穿着状态||'--'}</span></div>
<details style="font-size:11px;margin-top:6px;padding-top:6px;border-top:1px solid rgba(212,163,115,0.1)"><summary style="cursor:pointer;color:#A89680;list-style:none;display:flex;align-items:center;gap:6px">心理状态</summary>
<div class="rw" style="margin-top:6px"><span class="lb">性唤起</span>${bar('hot',c.性唤起度)}<span class="vl">${c.性唤起度??'--'}</span></div>
<div class="rw"><span class="lb">负罪感</span>${bar('cold',c.负罪感)}<span class="vl">${c.负罪感??'--'}</span></div>
<div class="rw"><span class="lb">占有欲</span>${bar('warm',c.占有欲)}<span class="vl">${c.占有欲??'--'}</span></div>
</details>`;
}

/**
 * 从 chat 级别变量读取 stat_data（MVU 框架的实时数据默认存储在此）
 */
function getStatData(): Record<string, any> {
  return _.get(getVariables({ type: 'chat' }), 'stat_data', {});
}

function renderBar($el: JQuery) {
  const stat = getStatData();
  if (stat && Object.keys(stat).length > 0) {
    $el.html(render(stat));
  } else {
    console.info('[状态栏] stat_data 为空，等待 MVU 数据初始化');
  }
}

function refresh($el: JQuery) {
  try {
    renderBar($el);
  } catch (e) {
    console.error('[状态栏] 刷新失败', e);
  }
}

$(() => {
  console.info('[状态栏] 加载中…');

  // 注入自定义 CSS 到 iframe 头部，以便 teleportStyle 能复制到酒馆页面
  $(`<style script_id="${getScriptId()}">${CSS}</style>`).appendTo('head');

  // 注入样式到酒馆页面
  const { destroy: destroyStyle } = teleportStyle();

  // 创建容器
  const $el = createScriptIdDiv().appendTo('#chat');

  // 首次渲染（从 chat 级别变量读取）
  renderBar($el);

  // 等待 MVU 框架初始化，然后监听变量更新
  let offMvuEvent: (() => void) | undefined;

  waitGlobalInitialized<typeof Mvu>('Mvu')
    .then(mvu => {
      console.info('[状态栏] MVU 已就绪');

      // 用 Mvu API 重新获取一次数据（更可靠）
      try {
        const mvuData = mvu.getMvuData({ type: 'chat' });
        if (mvuData?.stat_data && Object.keys(mvuData.stat_data).length > 0) {
          $el.html(render(mvuData.stat_data));
        }
      } catch (e) {
        console.warn('[状态栏] Mvu.getMvuData 失败，回退至 getVariables', e);
      }

      // 监听 MVU 变量更新结束事件，刷新状态栏
      offMvuEvent = eventOn(mvu.events.VARIABLE_UPDATE_ENDED, () => {
        refresh($el);
      });
    })
    .catch(() => {
      console.warn('[状态栏] MVU 未加载，使用轮询模式');
    });

  // 兜底定时刷新（确保 MVU 事件遗漏时也能更新）
  const timer = setInterval(() => refresh($el), 3000);

  // 聊天切换时重新加载
  const offChatChange = reloadOnChatChange();

  // 清理
  $(window).on('pagehide', () => {
    console.info('[状态栏] 卸载');
    clearInterval(timer);
    destroyStyle();
    $el.remove();
    if (offMvuEvent) offMvuEvent();
    offChatChange();
  });
});
