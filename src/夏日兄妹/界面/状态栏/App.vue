<template>
  <div class="statusbar">
    <!-- 顶栏 -->
    <div class="bar-header">
      <span class="bar-title">千夏</span>
      <span class="bar-sub">{{ data.系统.当前时间 }} · {{ data.系统.当前场景 }}</span>
    </div>

    <!-- 核心指标 -->
    <div class="bar-metrics">
      <div class="metric">
        <span class="label">阶段</span>
        <span class="stage-badge" :class="stageClass">{{ data.千夏.亲密阶段 }}</span>
      </div>
      <div class="metric">
        <span class="label">亲密度</span>
        <div class="bar-track">
          <div class="bar-fill bar-warm" :style="{ width: data.千夏.亲密度 + '%' }"></div>
        </div>
        <span class="value">{{ data.千夏.亲密度 }}</span>
      </div>
      <div class="metric">
        <span class="label">穿着</span>
        <span class="tag">{{ data.千夏.穿着状态 }}</span>
      </div>
    </div>

    <!-- 心理状态（可折叠） -->
    <div class="fold-section" @click="folded = !folded">
      <span class="fold-arrow" :class="{ folded }">▼</span>
      心理状态
    </div>
    <div class="fold-body" :class="{ folded }">
      <div class="metric">
        <span class="label">性唤起</span>
        <div class="bar-track">
          <div class="bar-fill bar-desire" :style="{ width: data.千夏.性唤起度 + '%' }"></div>
        </div>
        <span class="value">{{ data.千夏.性唤起度 }}</span>
      </div>
      <div class="metric">
        <span class="label">负罪感</span>
        <div class="bar-track">
          <div class="bar-fill bar-cold" :style="{ width: data.千夏.负罪感 + '%' }"></div>
        </div>
        <span class="value">{{ data.千夏.负罪感 }}</span>
      </div>
      <div class="metric">
        <span class="label">占有欲</span>
        <div class="bar-track">
          <div class="bar-fill bar-warm" :style="{ width: data.千夏.占有欲 + '%' }"></div>
        </div>
        <span class="value">{{ data.千夏.占有欲 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

const store = useDataStore();
const data = store.data;
const folded = ref(true);

const stageClass = computed(() => {
  const map: Record<string, string> = {
    '日常': 'stage-daily',
    '暧昧': 'stage-ambiguous',
    '沉沦': 'stage-indulge',
    '矛盾': 'stage-conflict',
  };
  return map[data.value.千夏.亲密阶段] || 'stage-daily';
});
</script>

<style scoped>
.statusbar {
  font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  color: #FFF8EC;
  background: linear-gradient(160deg, rgba(26,26,46,0.95), rgba(22,33,62,0.92));
  border: 1px solid rgba(212,163,115,0.2);
  border-radius: 8px;
  padding: 10px 14px;
  min-width: 220px;
  max-width: 360px;
  backdrop-filter: blur(8px);
  line-height: 1.4;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(212,163,115,0.15);
  margin-bottom: 8px;
}
.bar-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 14px;
  font-weight: 600;
  color: #E6B87D;
  letter-spacing: 1px;
}
.bar-sub {
  font-size: 11px;
  color: #A89680;
}

.bar-metrics {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 8px;
}
.label {
  font-size: 11px;
  color: #A89680;
  min-width: 36px;
  flex-shrink: 0;
}
.value {
  font-size: 11px;
  font-weight: 500;
  color: #FFF8EC;
  min-width: 22px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.bar-track {
  flex: 1;
  height: 5px;
  background: rgba(255,248,236,0.08);
  border-radius: 3px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}
.bar-warm { background: linear-gradient(90deg, #D4A373, #E8807A); }
.bar-cold { background: linear-gradient(90deg, #7FB5C8, #4A8BA8); }
.bar-desire { background: linear-gradient(90deg, #C96A65, #E8807A); }

.stage-badge {
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}
.stage-daily   { background: rgba(127,181,200,0.2); color: #7FB5C8; border: 1px solid rgba(127,181,200,0.3); }
.stage-ambiguous { background: rgba(230,184,125,0.2); color: #E6B87D; border: 1px solid rgba(230,184,125,0.3); }
.stage-indulge { background: rgba(232,128,122,0.2); color: #E8807A; border: 1px solid rgba(232,128,122,0.3); }
.stage-conflict { background: rgba(160,90,160,0.2); color: #C084C0; border: 1px solid rgba(160,90,160,0.3); }

.tag {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: rgba(212,163,115,0.12);
  border: 1px solid rgba(212,163,115,0.15);
  color: #D4A373;
}

.fold-section {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid rgba(212,163,115,0.1);
  font-size: 11px;
  color: #A89680;
  cursor: pointer;
  user-select: none;
}
.fold-section:hover { color: #E6B87D; }
.fold-arrow {
  font-size: 9px;
  transition: transform 0.3s ease;
}
.fold-arrow.folded { transform: rotate(-90deg); }
.fold-body {
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.25s ease;
  max-height: 120px;
  opacity: 1;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.fold-body.folded {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
}
</style>
