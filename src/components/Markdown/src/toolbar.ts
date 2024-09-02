export const toolbar = [
  "headings",
  "bold",
  "italic",
  {
    name: "quote",
    icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1702016470811" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3023" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M563.2 607.168a52.224 52.224 0 0 1 0-0.192v-0.064-0.192a460.48 460.48 0 0 1 223.104-394.56 51.2 51.2 0 0 1 52.928 87.68A359.04 359.04 0 0 0 699.648 454.4 153.472 153.472 0 1 1 563.2 607.168z m-409.6 0a52.224 52.224 0 0 1 0-0.192v-0.064-0.192a460.48 460.48 0 0 1 223.104-394.56 51.2 51.2 0 0 1 52.928 87.68A359.04 359.04 0 0 0 290.048 454.4 153.472 153.472 0 1 1 153.6 607.168z" p-id="3024"></path></svg>'
  },
  "link",
  {
    name: 'upload',
    tip: '上传图片',
    icon:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1702016730133" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1758" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M978.03377778 84.80237037H45.96622222v854.39525926h932.06755556z m-854.39525926 77.6722963h776.72296296v514.19060148L747.54123852 492.58192592l-190.68548741 190.68548741L317.81925925 325.39230815l-194.18074073 291.2711111z m0 699.05066666v-104.66341925l194.18074073-291.27111111 226.99728593 340.39883851L742.49253925 609.09037037 900.36148148 797.83405037V861.52533333z" fill="#333333" p-id="1759"></path><path d="M706.18074075 434.3277037a116.50844445 116.50844445 0 1 0-116.50844445-116.50844445 116.50844445 116.50844445 0 0 0 116.50844445 116.50844445z m0-155.34459259a38.83614815 38.83614815 0 1 1-38.83614816 38.83614814 38.83614815 38.83614815 0 0 1 38.83614816-38.83614814z" fill="#333333" p-id="1760"></path></svg>'
  },
  "code",
  "inline-code",
  "list",
  "ordered-list",
  "strike",
  "check",
  "table",
  "line",
  "outdent",
  "indent",
  "insert-before",
  "insert-after",
  "code-theme",
  "content-theme",
  "export",
  // "outline",
  // "devtools",
  // "fullscreen",
  // "preview",
  // "info",
  // "help",
  // "edit-mode",
  // "both",
]

export const liuchengtu = [
  {
    name: '流程图',
    icon: '流程图',
    level: 2,
textValue:`\`\`\`mermaid
graph TB
c1-->a2
subgraph one
a1-->a2
end
subgraph two
b1-->b2
end
subgraph three
c1-->c2
end
\`\`\``},
  {
    name: '时序图',
    icon: '时序图',
    level: 2,
textValue:`\`\`\`mermaid
sequenceDiagram
Alice->>John: Hello John, how are you?
John-->>Alice: Great!
Alice-)John: See you later!
\`\`\``},
  {
    name: '类图',
    icon: '类图',
    level: 2,
textValue:`\`\`\`mermaid
classDiagram
Animal <|-- Duck
Animal <|-- Fish
Animal <|-- Zebra
Animal : +int age
Animal : +String gender
Animal: +isMammal()
Animal: +mate()
class Duck{
+String beakColor
+swim()
+quack()
}
class Fish{
-int sizeInFeet
-canEat()
}
class Zebra{
+bool is_wild
+run()
}
\`\`\``
  },
  {
    name: '状态图',
    icon: '状态图',
    level: 2,
textValue:`\`\`\`mermaid
stateDiagram-v2
[*] --> Still
Still --> [*]

Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]
\`\`\``
  },
  {
    name: '关系图',
    icon: '关系图',
    level: 2,
textValue:`\`\`\`mermaid
erDiagram
CUSTOMER ||--o{ ORDER : places
ORDER ||--|{ LINE-ITEM : contains
CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
\`\`\``
  },
  {
    name: '旅程图',
    icon: '旅程图',
    level: 2,
textValue:`\`\`\`mermaid
journey
title My working day
section Go to work
Make tea: 5: Me
Go upstairs: 3: Me
Do work: 1: Me, Cat
section Go home
Go downstairs: 5: Me
Sit down: 5: Me
\`\`\``
  },
  {
    name: '甘特图',
    icon: '甘特图',
    level: 2,
textValue:`\`\`\`mermaid
gantt
title A Gantt Diagram
dateFormat  YYYY-MM-DD
section Section
A task           :a1, 2014-01-01, 30d
Another task     :after a1  , 20d
section Another
Task in sec      :2014-01-12  , 12d
another task      : 24d
\`\`\``
  },
  {
    name: '饼状图',
    icon: '饼状图',
    level: 2,
textValue:`\`\`\`mermaid
pie title Pets adopted by volunteers
"Dogs" : 386
"Cats" : 85
"Rats" : 15
\`\`\``
  },
  {
    name: '思维导图',
    icon: '思维导图',
    level: 2,
textValue:`\`\`\`mermaid
mindmap
Root
A
B
C
\`\`\``
  },
//                 {
//                   name: '时间抽',
//                   icon: '时间抽',
//                   level: 2,
//                   click: (event: Event, vditor: IVditor) => {
//                     insEditor?.insertValue(`\`\`\`mermaid
// timeline
//       title History of Social Media Platform
//       2002 : LinkedIn
//       2004 : Facebook
//            : Google
//       2005 : Youtube
//       2006 : Twitter
// \`\`\``

//               
//                   },
//                 },
]