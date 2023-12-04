import React from 'react';

const Table = ({ employees, handleEdit, handleDelete }) => {

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: null,
  });

  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Avatar</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Date</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, i) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>
                  {/* <img src={`https://csci5902-loki.s3.amazonaws.com/image_content_${employee.id}.png` || "https://images.freeimages.com/images/large-previews/0f9/halloween-pumpkins-2-1199288.jpg?fmt=webp&w=350"} alt="avatar" className='employee-avatar'/> */}
                  {employee.id && (
                    <img
                      src={`https://csci5902-loki.s3.amazonaws.com/image_content_${employee.id}.png`}
                      alt="avatar"
                      className="employee-avatar"
                      onError={(e) => {
                        e.target.src =
                          'https://images.freeimages.com/images/large-previews/0f9/halloween-pumpkins-2-1199288.jpg?fmt=webp&w=350';
                      }}
                    />
                  )}
                  </td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{formatter.format(employee.salary)}</td>
                <td>{employee.date} </td>
                <td className="text-right">
                  <button
                    onClick={() => handleEdit(employee.id)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No Employees</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
