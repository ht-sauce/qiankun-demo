export default {
  ttsEngine: [
    {
      label: '百度MRCP',
      value: 'unimrcp:baidutts',
      extend: '',
      children: [{ label: '度小文', value: 'fduxiaowen', extend: '1' }],
    },
    {
      label: '阿里',
      value: 'tts:133',
      extend:
        '{"speech_rate":{"min":-500,"max":500,"default":0},"pitch":{"min":-500,"max":500,"default":0},"volume":{"min":0,"max":100,"default":50}}',
      children: [
        { label: '艾夏', value: 'Aixia', extend: '' },
        { label: '小云', value: 'Xiaoyun', extend: '' },
        { label: '小刚', value: 'Xiaogang', extend: '' },
        { label: '艾彤', value: 'Aitong', extend: '' },
        { label: '艾薇', value: 'Aiwei', extend: '' },
        { label: '艾宝', value: 'Aibao', extend: '' },
        { label: '小玥', value: 'Xiaoyue', extend: '' },
        { label: '姗姗', value: 'Shanshan', extend: '' },
      ],
    },
    {
      label: '硅基',
      value: 'tts:150',
      extend:
        '{"speech_rate":{"min":-20,"max":20,"default":1},"pitch":{"min":-20,"max":20,"default":1},"volume":{"min":-20,"max":20,"default":1}}',
      children: [
        { label: 'mh', value: 'mh', extend: '' },
        { label: 'szj', value: 'szj', extend: '' },
        { label: 'tz', value: 'tz', extend: '' },
        { label: 'aixia', value: 'aixia', extend: '' },
      ],
    },
    {
      label: '百度',
      value: 'tts:151',
      extend:
        '{"speech_rate":{"min":0,"max":15,"default":5,"step":1},"pitch":{"min":0,"max":15,"default":5,"step":1},"volume":{"min":0,"max":15,"default":5,"step":1}}',
      children: [
        { label: '度小宇', value: '1', extend: '' },
        { label: '度小美', value: '0', extend: '' },
        { label: '度逍遥', value: '3', extend: '' },
        { label: '度丫丫', value: '4', extend: '' },
        { label: '度博文', value: '106', extend: '' },
        { label: '度小童', value: '110', extend: '' },
        { label: '度小萌', value: '111', extend: '' },
        { label: '度米朵', value: '103', extend: '' },
        { label: '度小娇', value: '5', extend: '' },
      ],
    },
    { label: '硅基xqs', value: 'xqs', extend: '' },
    {
      label: '硅基中英文',
      value: 'tts:20305',
      extend:
        '{"speech_rate":{"min":-20,"max":20,"default":1},"pitch":{"min":-20,"max":20,"default":1},"volume":{"min":-20,"max":20,"default":1}}',
      children: [{ label: 'xiaoxiao', value: 'xiaoxiao', extend: '' }],
    },
  ],
  asrEngine: [
    {
      label: '百度MRCP',
      value: 'unimrcp:baiduasr',
      extend: 'unimrcp:baiduasrunimrcp:baiduasrunimrcp:baiduasr',
    },
    { label: '阿里ASR', value: 'asr:135', extend: '阿里ASR' },
    { label: '阿里ASR英文', value: 'asr:141', extend: '阿里ASR英文阿里ASR英文阿里ASR英文' },
    { label: '硅基SLU', value: 'asr:137', extend: '硅基SLU' },
    { label: '阿里ASR+硅基SLU', value: 'asr:134', extend: '' },
    { label: '阿里asr(变频16k)', value: 'asr:300', extend: '' },
    { label: '硅基asr(变频16k)', value: 'asr:301', extend: '' },
    { label: '硅基vad+阿里asr(变频16k)', value: 'asr:20300', extend: '' },
    { label: '阿里实时', value: 'asr:152', extend: '' },
    { label: '硅基ASR', value: 'asr:154', extend: '' },
  ],
  intention: [
    { label: 'A', value: 'A', extend: '' },
    { label: 'B', value: 'B', extend: '' },
    { label: 'C', value: 'C', extend: '' },
    { label: 'D', value: 'D', extend: '' },
    { label: 'E', value: 'E', extend: '' },
    { label: 'F', value: 'F', extend: '' },
    { label: 'G', value: 'G', extend: '' },
    { label: 'H', value: 'H', extend: '' },
  ],
  NLP: [
    {
      label: '货拉拉',
      value: 'http://172.16.103.12/kbr-adapt/ext/kbr/ZHUIYI/getQuestion',
      extend: '',
    },
    { label: '货拉拉test-2', value: 'https://www.w3school.com.cn', extend: '' },
    { label: '5G', value: 'http://172.16.103.12/kbr-adapt-api/ext/kbr/5G/getQuestion', extend: '' },
  ],
}
