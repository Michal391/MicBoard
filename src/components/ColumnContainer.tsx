import { useMemo, useState } from "react";
import DelIcon from "../icons/DelIcon";
import { Column, Id, Task } from "../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    updateTask: (id:Id , content: string) => void;
    createTask: (columnId: Id) => void;
    tasks: Task[];
    deleteTask: (id:Id) => void;
}

function ColumnContainer(props: Props){
    const {column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask} = props;

    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(() => {
        return tasks.map(task => task.id)
    }, [tasks]);

    const {setNodeRef, attributes, listeners, transform, transition, isDragging} 
    = 
        useSortable({
            id:column.id,
            data: {
                type: "Column",
                column,
            },
            disabled: editMode,
        });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if(isDragging){
        return <div ref={setNodeRef} style={style} className="
        opacity-40
        border-2
        border-rose-500
        bg-columnBackgroundColor
        w-[350px]
        h-[800px]
        max-h-[800px]
        rounded-md
        flex
        flex-col
        ">

        </div>
    }

    return <div
        ref={setNodeRef}
        style={style}
        className="
        bg-columnBackgroundColor
        w-[350px]
        h-[800px]
        max-h-[800px]
        rounded-md
        flex
        flex-col
        "
    >
        {/* column title */}
        <div {...attributes} {...listeners} onClick={() => {setEditMode(true)}} className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
            <div className="flex gap-2">
                <div className="flex justify-center items-center gb-columnBackgroundColor px-2 py-1 text-sm rounded-full">0</div>
                {!editMode && column.title}
                {editMode && (
                    <input 
                        className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                        value={column.title}
                        onChange={e => updateColumn(column.id , e.target.value)}
                        autoFocus 
                        onBlur={() => {
                            setEditMode(false)
                        }} 
                        onKeyDown={e => {
                            if(e.key !== "Enter")return;
                            setEditMode(false);
                        }}
                    />
                )}
            </div>
            <button className="stroke-zinc-500 hover:stroke-white hover:bg-columnBackgroundColor rounded"
            onClick={() => {
                deleteColumn(column.id);
            }}>
                <DelIcon/>
            </button>
        </div>
        {/* column task container */}
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
            {
                <SortableContext items={tasksIds}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
                    ))}
                </SortableContext>
            }
        </div>
        {/* column footer */}
        <button onClick={() => {createTask(column.id);}} className="flex gap-2 items-center border-columnBackgroundColor norder-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black">
            <PlusIcon/>
            Add Task
        </button>
        </div>
}

export default ColumnContainer