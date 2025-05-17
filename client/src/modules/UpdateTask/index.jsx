import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../components/FormComponents/Input";
import Button from "../../components/GlobalComponents/Button";
import Select from "../../components/FormComponents/Select";
import createTaskImg from "../../assets/images/create-task.svg";
import { useParams } from "react-router-dom";
import { useGetTaskById, useUpdateTask } from "./service";

const schema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    status: yup.string().oneOf(["To Do", "In Progress", "Done"]).required(),
    priority: yup.string().oneOf(["Low", "Medium", "High"]).required(),
    dueDate: yup.date().nullable(),
});

const UpdateTask = () => {
    const { id } = useParams();

    console.log(id)

    const {
        control,
        handleSubmit,
        reset,
        trigger,
        getValues,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            status: "To Do",
            priority: "Medium",
            dueDate: null,
        },
    });

    const { data: taskData, isLoading } = useGetTaskById({
        id,
        setValue
    });
    const { mutate: updateTask } = useUpdateTask({ id, resetForm: reset });



    const onSubmit = async () => {
        const isValidationPassed = await trigger()

        if (!isValidationPassed) {
            return;
        }
        const values = getValues()
        updateTask(values)
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 w-[90%] max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="hidden md:flex items-center justify-center bg-orange-50 p-8">
                    <img
                        src={createTaskImg}
                        alt="Update Task Illustration"
                        className="max-w-xs md:max-w-sm"
                    />
                </div>

                <div className="p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="mb-6 text-3xl font-bold text-orange-600">
                        Update Task
                    </h2>


                    <p>Loading task details...</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    label="Title"
                                    placeholder="Enter task title"
                                    {...field}
                                    error={errors.title?.message}
                                />
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    label="Description"
                                    placeholder="Enter description"
                                    {...field}
                                    error={errors.description?.message}
                                />
                            )}
                        />

                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Status"
                                    options={[
                                        { value: "To Do", label: "To Do" },
                                        { value: "In Progress", label: "In Progress" },
                                        { value: "Done", label: "Done" },
                                    ]}
                                    error={errors.status?.message}
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Priority"
                                    options={[
                                        { value: "Low", label: "Low" },
                                        { value: "Medium", label: "Medium" },
                                        { value: "High", label: "High" },
                                    ]}
                                    error={errors.priority?.message}
                                    {...field}
                                />
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Updating..." : "Update Task"}
                        </Button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default UpdateTask;
