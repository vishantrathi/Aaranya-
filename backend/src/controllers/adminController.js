import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = async (_req, res) => {
  const [totalUsers, totalOrders, productCount, paidOrders] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.find({ paymentStatus: "Paid", orderStatus: { $ne: "Failed" } }),
  ]);

  const totalSales = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const lowStockProducts = await Product.find({ stock: { $lte: 10 } });

  res.json({
    totalUsers,
    totalOrders,
    productCount,
    totalSales,
    lowStockProducts,
  });
};

export const getUsers = async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!["customer", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role. Allowed roles: customer, admin");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = role;
  await user.save();

  res.json({
    message: "User role updated",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const getCustomerMetrics = async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) {
    dateFilter.$gte = new Date(startDate);
  }
  if (endDate) {
    dateFilter.$lt = new Date(new Date(endDate).getTime() + 86400000);
  }

  const customerMatch = { role: "customer" };
  if (Object.keys(dateFilter).length > 0) {
    customerMatch.createdAt = dateFilter;
  }

  const customers = await User.find(customerMatch)
    .select("name email phone createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const orderMatch = { user: { $ne: null } };
  if (Object.keys(dateFilter).length > 0) {
    orderMatch.createdAt = dateFilter;
  }

  const orderStats = await Order.aggregate([
    {
      $match: orderMatch,
    },
    {
      $group: {
        _id: "$user",
        totalOrders: { $sum: 1 },
        successfulOrders: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$paymentStatus", "Paid"] },
                  { $ne: ["$orderStatus", "Failed"] },
                ],
              },
              1,
              0,
            ],
          },
        },
        unsuccessfulOrders: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $ne: ["$paymentStatus", "Paid"] },
                  { $eq: ["$orderStatus", "Failed"] },
                ],
              },
              1,
              0,
            ],
          },
        },
        totalRevenue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$paymentStatus", "Paid"] },
                  { $ne: ["$orderStatus", "Failed"] },
                ],
              },
              "$totalAmount",
              0,
            ],
          },
        },
      },
    },
  ]);

  const orderStatsByUserId = orderStats.reduce((acc, item) => {
    acc[item._id.toString()] = item;
    return acc;
  }, {});

  const customerMetrics = customers.map((customer) => {
    const stats = orderStatsByUserId[customer._id.toString()];

    return {
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalOrders: stats?.totalOrders || 0,
      successfulOrders: stats?.successfulOrders || 0,
      unsuccessfulOrders: stats?.unsuccessfulOrders || 0,
      totalRevenue: stats?.totalRevenue || 0,
      createdAt: customer.createdAt,
    };
  });

  res.json(customerMetrics);
};
