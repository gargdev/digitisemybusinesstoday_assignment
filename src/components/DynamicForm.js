import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import formConfig from '../config/formConfig.json';

const DynamicForm = () => {
  const validationSchema = formConfig.reduce((acc, field) => {
    let schema = field.required ? Yup.string().required('Required') : Yup.string();
    if (field.regex) {
      schema = schema.matches(new RegExp(field.regex), 'Invalid format');
    }
    acc[field.name] = schema;
    return acc;
  }, {});

  const formik = useFormik({
    initialValues: formConfig.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {}),
    validationSchema: Yup.object(validationSchema),
    onSubmit: values => {
      console.log('Form Values', values);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-8 bg-white rounded shadow-md space-y-6">
      {formConfig.map(field => {
        switch (field.type) {
          case 'text':
          case 'password':
            return (
              <div key={field.id} className="flex flex-col">
                <label htmlFor={field.name} className="mb-2 text-gray-700">{field.label}</label>
                <input
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched[field.name] && formik.errors[field.name] ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</div>
                ) : null}
              </div>
            );
          case 'select':
            return (
              <div key={field.id} className="flex flex-col">
                <label htmlFor={field.name} className="mb-2 text-gray-700">{field.label}</label>
                <select
                  id={field.id}
                  name={field.name}
                  multiple={field.multiSelect}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {field.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formik.touched[field.name] && formik.errors[field.name] ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</div>
                ) : null}
              </div>
            );
          case 'radio':
            return (
              <div key={field.id} className="flex flex-col">
                <label className="mb-2 text-gray-700">{field.label}</label>
                {field.options.map(option => (
                  <label key={option.value} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
                {formik.touched[field.name] && formik.errors[field.name] ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</div>
                ) : null}
              </div>
            );
          case 'file':
            return (
              <div key={field.id} className="flex flex-col">
                <label htmlFor={field.name} className="mb-2 text-gray-700">{field.label}</label>
                <input
                  id={field.id}
                  name={field.name}
                  type="file"
                  onChange={(event) => {
                    formik.setFieldValue(field.name, event.currentTarget.files[0]);
                  }}
                  onBlur={formik.handleBlur}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched[field.name] && formik.errors[field.name] ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</div>
                ) : null}
              </div>
            );
          default:
            return null;
        }
      })}
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
