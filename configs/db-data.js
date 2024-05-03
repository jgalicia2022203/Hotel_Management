import User from "../src/users/user.model.js";
export const DBData = async () => {
  const lengthUsers = await User.countDocuments();
  if (lengthUsers > 0) return;

  const adminUser = new User({
    name: "Admin",
    username: "Admin",
    email: "admin@outlook.es",
    password: "123456",
    role: "ADMIN",
  });

  adminUser.save();

  const adminHotelUser = new User({
    name: "AdminHotel",
    username: "AdminHotel",
    email: "adminHotel@outlook.es",
    password: "123456",
    role: "ADMIN_HOTEL",
  });

  adminHotelUser.save();

  const clientUser = new User({
    name: "Client",
    username: "client",
    email: "client@outlook.es",
    password: "123456",
    role: "CLIENT",
  });

  clientUser.save();
};
