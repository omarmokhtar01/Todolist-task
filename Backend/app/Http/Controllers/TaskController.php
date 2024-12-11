<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        $dueDate = $request->input('due_date');
        $query = Task::with('categories')
        ->where('user_id', $request->user()->id);

        if (!is_null($status) && in_array($status, ['pending', 'completed'])) {
            $query->where('status', '=', $status);
        }

 if (!is_null($dueDate)) {
        $query->whereDate('due_date', '=', $dueDate);
    }
    $tasks = $query->paginate(10);

        return response()->json([
            'data' => $tasks
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $user = auth()->user();
		if (!$user) {
    return response()->json(['message' => 'Unauthorized'], 401);
}

        $validate = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'status' => 'in:pending,completed',
        'categories_id' => 'required|exists:categories,id',
    ]);

   $task = new Task();
$task->fill($validate);  
$task->user_id = $user->id;  
$task->save();

         return Response::json([
        'data' => $task,
		'user_id'=>$user->id,
        'message' => 'Task created successfully'
    ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $task = Task::with('categories')->findOrFail($id);
        return response()->json($task, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status' => 'in:pending,completed',
            'categories_id' => 'nullable|exists:categories,id',

        ]);

        $task->update($validated);

        return response()->json([
            'data' => $task,
            'message' => 'Task updated successfully'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(['message' => 'Task soft deleted'], 200);
    }
    public function trashed()
    {
        $tasks = Task::with('categories')->onlyTrashed()->paginate(10);
		if ($tasks->isEmpty()) {
        return response()->json([
            'message' => 'No trashed tasks found',
        ], 404);
    }

        return response()->json([
            'data' => $tasks,
            'message' => 'Trashed tasks retrieved successfully',
        ], 200);
    }

    public function restore($id)
    {
        $task = Task::onlyTrashed()->findOrFail($id);

        if ($task->deleted_at) {
            $task->restore();
            return response()->json(['message' => 'Task restored'], 200);
        }

        return response()->json(['message' => 'Task is not deleted'], 400);
    }


    public function forceDelete($id)
    {
        $task = Task::withTrashed()->findOrFail($id);

        $task->forceDelete();

        return response()->json(['message' => 'Task permanently deleted'], 200);
    }


}
