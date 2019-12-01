---
title: API
---

### Props

#### value

Type: ```Array```

Required: ```false```

Default: ```undefined```

是一个与拖放同步的数组。

#### handle

Type: ```String```

Required: ```true```

Default: ```undefined```

可以被拖放元素的 className，当元素没有 ```handle``` className 时，此元素不可被拖放或者被交换位置。

#### columns

Type: ```Number```

Required: ```false```

Default: ```1```

展示元素的列数。

### Events

支持的事件有：```choose```，```un-choose```，```start```，```end```，```update```

- ```event```：事件名
- ```oldIndex```：已移动元素的旧索引
- ```newIndex```：已移动元素的当前索引
- ```item```：移动的元素

