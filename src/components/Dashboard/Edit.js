import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { editEmployee } from '../../api';

const Edit = ({ employees, selectedEmployee, setEmployees, setIsEditing }) => {
  const id = selectedEmployee.id;

  const [firstName, setFirstName] = useState(selectedEmployee.firstName);
  const [lastName, setLastName] = useState(selectedEmployee.lastName);
  const [email, setEmail] = useState(selectedEmployee.email);
  const [salary, setSalary] = useState(selectedEmployee.salary);
  const [date, setDate] = useState(selectedEmployee.date);
  const placeholderImageURL = 'https://www.pngarts.com/files/2/Upload-PNG-Transparent-Image.png';
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(placeholderImageURL);
  const username = "image";

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !salary || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const employee = {
      id,
      firstName,
      lastName,
      email,
      salary,
      date,
    };

    const editedEmployee = await editEmployee(employee);
    setEmployees((prevEmployees) => {
      return prevEmployees.map((prevEmployee) => {
        if (editedEmployee.id === prevEmployee.id) {
          return editedEmployee;
        }
        return prevEmployee;
      }
      );
    });

    setIsEditing(false);

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: `${employee.firstName} ${employee.lastName}'s data has been updated.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };


  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(placeholderImageURL);
    }
  };

  const handleUploadImage = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result.split(',')[1];
        const timestamp = Date.now();
        const filename = `${username}_content_${id}.jpg`;
        const requestBody = {
          content: base64Image,
          username: username,
          filename: filename,
        };
        console.log(requestBody);

        fetch('https://atk13nn80e.execute-api.us-east-1.amazonaws.com/dev', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to upload image');
            }
          })
          .then((data) => {
            console.log(data);
            alert('Image uploaded successfully!');
            sessionStorage.setItem('filename', filename);
          })
          .catch((error) => {
            console.error(error);
            alert('Error uploading image');
          });
      };

      reader.readAsDataURL(selectedFile);
    } else {
      alert('Please choose an image to upload.');
    }
  };

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit Employee</h1>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="salary">Salary ($)</label>
        <input
          id="salary"
          type="number"
          name="salary"
          value={salary}
          onChange={e => setSalary(e.target.value)}
        />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <div >
          <input type="file" id="uploadInput" onChange={handleFileInputChange} />
          <button onClick={handleUploadImage} >
            Upload Image
          </button>
        </div>
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Edit;
