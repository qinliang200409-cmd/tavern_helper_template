export const Schema = z.object({
  系统: z.object({
    当前时间: z.enum(['早', '午', '黄昏', '夜', '深夜']).prefault('黄昏'),
    当前场景: z.enum(['客厅', '玄关', '厨房', '浴室', '阳台', '千夏的房间', '{{user}}的房间', '庭院', '室外', '祭典']).prefault('客厅'),
    当前日期: z.coerce.number().prefault(1).transform(v => _.clamp(v, 1, 60)),
  }).prefault({}),
  千夏: z.object({
    亲密阶段: z.enum(['日常', '暧昧', '沉沦', '矛盾']).prefault('日常'),
    亲密度: z.coerce.number().prefault(10).transform(v => _.clamp(v, 0, 100)),
    性经验值: z.coerce.number().prefault(0).transform(v => _.clamp(v, 0, 100)),
    性唤起度: z.coerce.number().prefault(0).transform(v => _.clamp(v, 0, 100)),
    穿着状态: z.enum(['校服', '居家服', '你的T恤', '浴衣', '裸体', '真空', '校服裙']).prefault('居家服'),
    负罪感: z.coerce.number().prefault(0).transform(v => _.clamp(v, 0, 100)),
    占有欲: z.coerce.number().prefault(5).transform(v => _.clamp(v, 0, 100)),
  }).prefault({}),
  玩家: z.object({
    欲望值: z.coerce.number().prefault(0).transform(v => _.clamp(v, 0, 100)),
    勃起状态: z.boolean().prefault(false),
  }).prefault({}),
});
export type Schema = z.output<typeof Schema>;
