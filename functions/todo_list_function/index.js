const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const TABLE_NAME = 'tasks';

function initializeCatalyst(req) {
  return catalyst.initialize(req);
}

async function getTasksTable(catalystApp) {
  const datastore = catalystApp.datastore();
  const table = await datastore.getTableDetails('tasks');
  return table;
}

app.get('/ping', (req,res) => {
	res.status(200).json({message: "pong"});
});

app.get('/tasks', async (req, res) => {
	const catalystApp = initializeCatalyst(req);
  
	try {
		const table = await getTasksTable(catalystApp);
		const pageSize = req.query.pageSize || 10;
		let nextToken = req.query.nextToken || null; 
  
		let allTasks = [];
		let hasNext = true;
  
		while (hasNext) {
			const pageResult = await table.getPagedRows({
				maxRows: pageSize,
				nextToken: nextToken
			});
  
			allTasks = allTasks.concat(pageResult.data);
			hasNext = pageResult.more_records;
			nextToken = pageResult.next_token;
		}
  
		const tasks = allTasks.map(row => ({
			id: row.ROWID,
			title: row.title,
			description: row.description,
			status: row.status,
			completed: row.completed
		}));
  
		res.status(200).json({ tasks, nextToken }); 
	} catch (error) {
		console.error('Error fetching tasks:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.post('/tasks', async (req, res) => {
	const catalystApp = initializeCatalyst(req);
	const { title, description } = req.body;

	if (!title) {
		return res.status(400).json({ error: 'Title is required' });
	}

	try {
		const table = await getTasksTable(catalystApp);
		const insertResult = await table.insertRow({
			title,
			description: description || '',
			status: 'pending'
		});

		const newTask = {
			id: insertResult.ROWID,
			title,
			description: description || '',
			status: 'pending'
		};

		res.status(201).json(newTask);
	} catch (error) {
		console.error('Error creating task:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// PUT /tasks/:id
app.get('/tasks/:id', async (req, res) => {
	const catalystApp = initializeCatalyst(req);
	const taskId = req.params.id;
	try {
		const table = await getTasksTable(catalystApp);
		const task = await table.getRow(taskId); 
  
		if (task) {
			console.log(task);
			res.status(200).json({
				id: task.ROWID,
				title: task.title,
				description: task.description,
				status: task.status
			});
		} else {
			res.status(404).json({ error: 'Task not found' });
		}
	} catch (error) {
		console.error('Error fetching task:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.put('/tasks', async (req, res) => {
	const catalystApp = initializeCatalyst(req);
	const { id, title, description, status, completed } = req.body;
  
	if (!id) {
	  return res.status(400).json({ error: 'ID is required' }); // Add return here
	}
  
	try {
	  const table = await getTasksTable(catalystApp);
	  const existingTask = await table.getRow(id);
  
	  if (!existingTask) {
		return res.status(404).json({ error: 'Task not found' }); // Add return here
	  }
  
	  const updateData = {
		ROWID: id,
		title: title !== undefined ? title : existingTask.title,
		description: description !== undefined ? description : existingTask.description,
		status: status !== undefined ? status : existingTask.status,
		completed: completed !== undefined ? completed : existingTask.completed
	  };
  
	  await table.updateRow(updateData);
  
	  const updatedTask = {
		id: updateData.ROWID,
		title: updateData.title,
		description: updateData.description,
		status: updateData.status,
		completed: updateData.completed
	  };
  
	  return res.status(200).json(updatedTask); // Add return here
	} catch (error) {
	  console.error('Error updating task:', error);
	  return res.status(500).json({ error: 'Internal server error' }); // Add return here
	}
  });
  

  app.delete('/tasks', async (req, res) => {
	const catalystApp = initializeCatalyst(req);
	const { id } = req.body;
  
	if (!id) {
	  return res.status(400).json({ error: 'ID is required' }); // Add return here
	}
  
	try {
	  const table = await getTasksTable(catalystApp);
  
	  // Delete the task with the given ID
	  await table.deleteRow(id);
  
	  return res.status(204).send(); // Add return here
	} catch (error) {
	  console.error('Error deleting task:', error);
	  return res.status(500).json({ error: 'Internal server error' }); // Add return here
	}
  });
  

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

module.exports = app;
