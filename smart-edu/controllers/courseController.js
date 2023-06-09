const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });
    req.flash("success", `${course.name} has been created successfully.`);
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error", `Something happened!`);
    res.status(201).redirect("/courses");
  }
};
exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;

    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }
    if (query) {
      filter = { name: query };
    }
    if (!query && !categorySlug) {
      filter.name = "";
      filter.category = null;
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
        { category: filter.category },
      ],
    })
      .sort("-dateCreated")
      .populate("user")
      .populate("category");

    const categories = await Category.find();
    res.status(200).render("courses", {
      courses,
      categories,
      pageName: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error,
    });
  }
};
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("user")
      .populate("category");
    const user = await User.findOne({ _id: req.session.userID });
    const categories = await Category.find();
    res.status(200).render("course-single", {
      course,
      categories,
      user,
      pageName: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error,
    });
  }
};
exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.addToSet({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/user/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("/user/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ slug: req.params.slug });
    req.flash("error", `${course.name} has been deleted.`);
    res.status(200).redirect("/user/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
exports.updateCourse = async (req, res) => {
  console.log("salam");
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;

    course.save();
    req.flash("success", `${course.name} has been updated.`);
    res.status(200).redirect("/user/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
