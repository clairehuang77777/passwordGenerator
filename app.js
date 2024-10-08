//透過express建立server
/*const express = require('express')
const path = require('path');  // 加入這行來引入 path 模組
const app = express()
const port = 3000
*/

//改成用express-handlebars, 重新引入expresshandlebar
const express = require('express')
const path = require('path');  // 加入這行來引入 path 模組
const { create } = require('express-handlebars'); // 引入 create 函式
const port = 3000
const app = express();

// 建立 Handlebars 實例，並設定副檔名為 .hbs, 停用預設佈局
const hbs = create({ extname: '.hbs',defaultLayout: false});

//設定hbs作為模板引擎
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')) // 設定 views 的資料夾路徑


//設定靜態資源檔案: 自定義的stylesheet & fontawesome 
app.use(express.static(path.join(__dirname, 'public')));

// 定義app可以解析透過submit傳來的資訊(用urlencoded的方式)
app.use(express.urlencoded({ extended: true }))

//當user要放問/ 會傳入main.html file
app.get('/', (req, res) => {
  res.render('index',{ layout: false}) //停用layouts, 直接渲染index.hbs
})


app.post('/generatedpassword',(req , res) => {
  let response = req.body
  console.log("接收到的表單資料：", response)
  
  //變數移到此處進行初始化,讓資料源[]內部清空
  let OutputData = []
  let dataResources = [] //儲存資料用的框框

  //有打勾會回傳 true, 沒打勾回傳undefined
  let passwordLength = response.passwordLength
  let IncludeLowercase = response.includeLowercase === 'true' //要小寫true
  let IncludeUppercase = response.includeUppercase === 'true' //要大寫true
  let IncludeNumbers = response.includeNumbers === 'true' //要數字true
  let IncludeSymbols =response.includeSymbols === 'true' //要符號true
  let ExcludeCharacters = response.excludeCharacters

  //定義資料
  const LData =['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  const UData = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  const NData = ['0','1','2','3','4','5','6','7','8','9']
  const SData = ['!','#','$','%','*','?','@']
  

  //定義邏輯,如果有被勾選，則加入該資料進去資料源內
  if (IncludeLowercase) dataResources = dataResources.concat(LData)
  if (IncludeUppercase) dataResources = dataResources.concat(UData)
  if (IncludeNumbers) dataResources = dataResources.concat(NData)
  if (IncludeSymbols) dataResources = dataResources.concat(SData)
  
  // 如果ExcludeCharacters有值的話，會先對dataResources做一層過濾
  if (ExcludeCharacters){
    let ExcludeCharactersArray = ExcludeCharacters.split('')

    for (i = 0 ; i < ExcludeCharactersArray.length ; i = i +1){
    dataResources = dataResources.filter(function(dataSource){
      return dataSource != ExcludeCharactersArray[i]
    })
  }
}

  console.log(dataResources)
  console.log(ExcludeCharacters)

  let finalPassword = '' //最後要呈現的字串

  //在user指定的"密碼長度"區間內跑迴圈
  for (let i = 0 ; i < passwordLength; i=i+1) {
  let randomIndex = Math.floor(Math.random() * dataResources.length)
  let randomSelectCharacter = dataResources[randomIndex]
  //console.log(randomSelectCharacter)
  OutputData.push(randomSelectCharacter)
  }
  
  // 把finalPassword的陣列移除","並印出來,並加一段邏輯, 如果資源沒有值(代表沒有選任何東西),則顯示要至少選一個
  if (dataResources.length === 0){
    finalPassword = "You have to at least select 1 item!"
    console.log(dataResources)
  } else {
    finalPassword = OutputData.join("")
    console.log(finalPassword)
    console.log(dataResources)
  }


  //使用render傳遞資料到前端
  res.render('index',{layout:false , password: finalPassword}) //停用layout佈局
})


app.listen(port, () => {
  console.log(`伺服器正在${port}上運行`)
})
