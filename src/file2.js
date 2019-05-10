// import { firstname,lastname } from './file1.js';
// console.log(firstname);
// export { firstname }

// 用对象方式导入另外文件所有变量
// import * as person from './file1.js'
// console.log(person.firstname);

// 导入别名
// import { firstname as foo } from './file1.js';
// console.log(foo);

//  default
// import person from './file1.js';
// console.log(person.firstname);
// console.log(person.lastname)

// 使用别名
import developer,{firstname,lastname} from './file1.js'
console.log(developer);
// console.log(firstname1);
