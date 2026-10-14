// Seeds 30 test users (emails end in @seed.dev, password Test@1234) and
// random connection requests from them. Re-running replaces the old seed data.
// Usage: node scripts/seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../src/models/user");
const ConnectionRequest = require("../src/models/connectionRequest");

const DB_URL = "mongodb://127.0.0.1:27017/devtinder";
const SEED_DOMAIN = "@seed.dev";
const PASSWORD = "Test@1234";
const USER_COUNT = 30;
const REQUESTS_PER_USER = [3, 8]; // min, max

const FIRST_NAMES = [
  "Arjun", "Meera", "Rahul", "Ananya", "Vikram", "Priya", "Karthik", "Sneha",
  "Rohan", "Divya", "Aditya", "Kavya", "Nikhil", "Pooja", "Siddharth", "Riya",
  "Varun", "Neha", "Akash", "Isha", "Manoj", "Lakshmi", "Suresh", "Anjali",
  "Deepak", "Nisha", "Gokul", "Sana", "Hari", "Fathima",
];
const LAST_NAMES = [
  "Nair", "Menon", "Sharma", "Iyer", "Reddy", "Pillai", "Kumar", "Das",
  "Varma", "Joseph", "Thomas", "Rao", "Gupta", "Shetty", "Khan",
];
const ABOUTS = [
  "Full stack dev who loves React and Node.",
  "Backend engineer, into distributed systems and coffee.",
  "Frontend nerd. CSS is my love language.",
  "Building side projects on weekends.",
  "Learning Rust, slowly but surely.",
  "Open source contributor and chai enthusiast.",
  "Mobile dev, Flutter and React Native.",
  "Data engineer who enjoys clean pipelines.",
  "DevOps person. If it is not automated, it is broken.",
  "Looking for a hackathon teammate.",
];
const FEMALE = new Set([
  "Meera", "Ananya", "Priya", "Sneha", "Divya", "Kavya", "Pooja", "Riya",
  "Neha", "Isha", "Lakshmi", "Anjali", "Nisha", "Sana", "Fathima",
]);

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const randomStatus = () => {
  const r = Math.random();
  if (r < 0.6) return "interested";
  if (r < 0.8) return "ignored";
  if (r < 0.95) return "accepted";
  return "rejected";
};

const seed = async () => {
  await mongoose.connect(DB_URL);

  // remove the previous seed run
  const oldSeedUsers = await User.find({ email: { $regex: SEED_DOMAIN.replace(".", "\.") + "$" } }).select("_id");
  const oldIds = oldSeedUsers.map((u) => u._id);
  const removedReqs = await ConnectionRequest.deleteMany({
    $or: [{ fromUserId: { $in: oldIds } }, { toUserId: { $in: oldIds } }],
  });
  await User.deleteMany({ _id: { $in: oldIds } });
  console.log(`Removed ${oldIds.length} old seed users and ${removedReqs.deletedCount} of their requests`);

  const password = await bcrypt.hash(PASSWORD, 10);
  const users = FIRST_NAMES.slice(0, USER_COUNT).map((firstName, i) => ({
    firstName,
    lastName: pick(LAST_NAMES),
    email: `${firstName.toLowerCase()}${i + 1}${SEED_DOMAIN}`,
    age: randInt(20, 40),
    gender: FEMALE.has(firstName) ? "female" : Math.random() < 0.9 ? "male" : "others",
    about: pick(ABOUTS),
    password,
  }));
  const created = await User.insertMany(users);
  console.log(`Created ${created.length} users`);

  // seed users send requests to anyone, including existing real users
  const everyone = await User.find({}).select("_id");
  const pairs = new Set(
    (await ConnectionRequest.find({}).select("fromUserId toUserId")).flatMap((r) => [
      `${r.fromUserId}-${r.toUserId}`,
      `${r.toUserId}-${r.fromUserId}`,
    ])
  );

  const requests = [];
  for (const from of created) {
    const wanted = randInt(...REQUESTS_PER_USER);
    const targets = everyone
      .filter((u) => !u._id.equals(from._id))
      .sort(() => Math.random() - 0.5);

    let sent = 0;
    for (const to of targets) {
      if (sent >= wanted) break;
      const key = `${from._id}-${to._id}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      pairs.add(`${to._id}-${from._id}`);
      requests.push({ fromUserId: from._id, toUserId: to._id, status: randomStatus() });
      sent++;
    }
  }
  await ConnectionRequest.insertMany(requests);

  const byStatus = requests.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {});
  console.log(`Created ${requests.length} requests`, byStatus);

  await mongoose.disconnect();
};

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
