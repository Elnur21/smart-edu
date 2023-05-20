const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID
    });
    // res.status(201).json({
    //   status: "success",
    //   course: course,
    // });
    res.status(201).redirect("/courses")
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error,
    });
  }
};
exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const category = await Category.findOne({slug:categorySlug})

    let filter = {};
    if(categorySlug) {
      filter = {category:category._id}
    }
    const courses = await Course.find(filter).sort("-dateCreated");

    const categories = await Category.find()
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
    const course = await Course.findOne({ slug: req.params.slug });
    res.status(200).render("course-single", {
      course,
      pageName: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error,
    });
  }
};
