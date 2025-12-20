const Validate = require("@/validate/index");
class UserController {
  //用户登录
  async wxLogin(ctx) {
    const { name, age } = ctx.request.body;
    await Validate.nullCheck(name, "用户名不能为空", "name");
    await Validate.nullCheck(age, "年龄不能为空", "age");
    console.log(name);
    ctx.send([1, 2, 3]);
  }
}
module.exports = new UserController();
