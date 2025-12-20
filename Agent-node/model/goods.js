const { Schema, model, mongoose } = require("@/config/database");
const dayjs = require("dayjs");
//定义商品字段
const GoodsSchema = new Schema(
  {
    //封面图
    coverImage: {
      type: String,
      required: true,
    },
    //商品名称
    contentTitle: {
      type: String,
      required: true,
    },
    //价格
    price: {
      type: Number,
      required: true,
    },
    //详情图
    productImages: {
      type: [String],
      required: true,
    },
    //创建时间
    createTime: {
      type: String,
      default: () => dayjs().format("YYYY-MM-DD HH:mm:ss"),
    },
  },
  { versionKey: false }
);
module.exports = {
  modelGoods: model("goods", GoodsSchema),
};
