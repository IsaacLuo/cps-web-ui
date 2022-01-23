const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("koa-bodyparser");
const app = new Koa();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname,"../db/BarCount.db"));


app.use(bodyParser());

// logger
// app.use(async (ctx, next) => {
//   await next();
//   const rt = ctx.response.get('X-Response-Time');
//   console.log(`${ctx.method} ${ctx.url} - ${rt}`);
// });


const router = new Router()

// router
router.get('/api/state', async (ctx)=>{
  await new Promise(resolve=>{
    // db.serialize(()=>{
      db.get("select * from Set_State;", (err, row)=>{
        if(err) {
          ctx.status = 500;
        }
        ctx.body = row;
        resolve();
      })
    // })
  })
  // ctx.body = {hello:'world1'};
})
router.post('/api/start', async (ctx)=>{
  await new Promise((resolve, reject)=>{
    db.run("UPDATE Set_State SET Cmd_Stop_Start='Start';", (err)=>{
      if (err) {
        ctx.status = 500;
        ctx.body = {error:err};
        reject();
      } else {
        ctx.body = {message:"success", error:err}
        resolve();
      }
    })
  })
})

router.post('/api/stop', async (ctx)=>{
  await new Promise((resolve, reject)=>{
    db.run("UPDATE Set_State SET Cmd_Stop_Start='Stop';", (err)=>{
      if (err) {
        ctx.status = 500;
        ctx.body = {error:err};
        reject();
      } else {
        ctx.body = {message:"success", error:err}
        resolve();
      }
    })
  })
})

router.post('/api/setting', async (ctx)=>{
  const {newCount, newDiameter} = ctx.request.body;
  await new Promise((resolve, reject)=>{
    db.run("UPDATE Set_State SET Cmd_Num_BD=?, Cmd_Num_Diam=?, Cmd_New_Set='New';",[newCount,newDiameter], (err)=>{
      if (err) {
        ctx.status = 500;
        ctx.body = {error:err};
        reject();
      } else {
        ctx.body = {message:"success", error:err}
        resolve();
      }
    })
  })
})

app.use(router.routes());

// static
app.use(serve(__dirname + '/../public'));


app.listen(3000);