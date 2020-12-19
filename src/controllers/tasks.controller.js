import Task from '../models/Tasks';
import { getPagination } from '../libs/getPagination';

export const findAllTasks = async (req, res) => {
  try {
    const { size, page, title } = req.query;

    const condition = title
      ? {
          title: { $regex: new RegExp(title), $options: 'i' },
        }
      : {};

    // console.log(condition);
    const { limit, offset } = getPagination(page, size);
    const data = await Task.paginate(condition, { offset, limit });

    res.json({
      totalItems: data.totalDocs,
      tasks: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (error) {
    res.statis(500).json({
      message: error.message || 'Something went wrong retrieving the task',
    });
  }
};

export const createTask = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ message: 'Content cannot be empty' });
  }

  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      done: req.body.done ? req.body.done : false,
    });
    const taskSaved = await newTask.save();
    res.json('New task created');
  } catch (error) {
    res.statis(500).json({
      message: error.message || 'Something went wrong creating the task',
    });
  }
};

export const findOneTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ message: `Tasks with id ${id} does not exist` });

    res.json(task);
  } catch (error) {
    res.statis(500).json({
      message: error.message || `Error retrieving Task with id: ${id}`,
    });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Task.findByIdAndDelete(id);
    res.json({
      message: `${data.title} task were deleted successfully`,
    });
  } catch (error) {
    res.statis(500).json({
      message: error.message || `Error deleting Task with id: ${id}`,
    });
  }
};

export const updateTask = async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
  });
  res.json({
    message: 'Task was updated successfully',
  });
};

export const findAllDoneTask = async (req, res) => {
  const tasks = await Task.find({ done: true });
  res.json(tasks);
};
