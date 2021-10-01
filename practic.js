let cc = `(`;
let dd = `)AS(`;
let ee = `)`;
let input = {
  foo: 2,
  bar: 6,
  baz: 4,
};
for (const [index, [key, value]] of Object.entries(Object.entries(input))) {
  if (index == 0) {
    cc = cc + key;
    dd = dd + value;
  } else {
    cc = cc + "," + key;
    dd = dd + "," + value;
  }
}
console.log(`${cc}${dd}${ee}`);
let chunked = [[1,2,3], [4,5,6], [7,8,9]];

for(let i = 0; i < chunked.length; i++) {
  
   for(let j = 0; j < chunked[i].length; j++) {
     
      console.log(chunked[i][j]);
   }
}