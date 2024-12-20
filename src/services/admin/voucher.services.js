const { Voucher } = require("../../models/voucher.model");
const convertToObjectId = require("../../utils/convert-type-object");
class VoucherService {
  static getVouchers = async (option) => {
    if (option.search) {
      option.filter.$or = [];
      option.filter.$or.push({
        _id:option.search
      });
      option.filter.$or.push({
        code: {$regex: option.search, $options: "i"},
      });
    }
    const [vouchers, pageCount] = await Promise.all([
      Voucher.find(option.filter)
        .populate({ path: "currency", select: "_id symbol name" })
        .sort({ createdAt: option.sort })
        .skip((option.page - 1) * option.page_limit)
        .limit(option.page_limit)
        .lean()
        .exec(),
      Voucher.countDocuments(option.filter).then((count) =>
        Math.ceil(count / option.page_limit)
      ),
    ]);
    return { vouchers, pageCount };
  };
  static getVoucherDetails = async (voucherID) => {
    console.log(voucherID);
    return await Voucher.findById(convertToObjectId(voucherID))
      .populate({ path: "partnerID", select: "_id name image" })
      .lean()
      .exec();
  };
}
module.exports = {
  VoucherService,
};
