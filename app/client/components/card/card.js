import styles from './card.module.scss'
import Button from '../button/button'
import Input from '../input/input'
import { useState } from 'react';

export default function Card({children, id, edit, add}) {

  async function saveForm(event) {
    // Calls specified function depending on which form was submitted
    !edit ? await addAddress(event) : await editAddress(event);
  }

  async function addAddress(event) {
    try {
      // Calls server's API endpoint to add the address from the form input
      // Contains method, headers, and body
      const res = await fetch('http://localhost:3001/addresses', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          line1: event.target.line1.value,
          line2: event.target.line2.value,
          city: event.target.city.value,
          state: event.target.state.value,
          zip: event.target.zip.value
        })
      });
      return await res.json();
    }
    catch(err) {
      console.log(err);
    }
  }

  async function editAddress(event) {
    try {
      // Calls server's API endpoint to edit the address from the form input
      // Contains method, headers, and body
      const res = await fetch(`http://localhost:3001/addresses/${id}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          line1: event.target.line1.value,
          line2: event.target.line2.value,
          city: event.target.city.value,
          state: event.target.state.value,
          zip: event.target.zip.value
        })
      });
      return await res.json();
    }
    catch(err) {
      console.log(err);
    }
  }

  async function deleteAddress(event) {
    try {
      // Calls server's API endpoint to delete the specified address 
      // Contains method and headers
      const res = await fetch(`http://localhost:3001/addresses/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await res.json();
      // Checks that status code is in the 200s (request was successful)
      if (res.status < 300) {
        window.location = "";
        console.log('deleted ' + id);
      }
    }
    catch(err) {
      console.log(err);
    }
  }

  // Declares new state variable to keep track of button click state
  const [editorButtonClickedState, changeEditorButtonClickedState] = useState(false);

  function clickedEditButton(){
    // Changes buttonClickedState and opens or closes the form editor
    const value = document.getElementById(`editButton${id}`).innerHTML;
    value == "Edit" ?  document.getElementById(`editButton${id}`).innerHTML = "Cancel" : 
      document.getElementById(`editButton${id}`).innerHTML = "Edit";
    changeEditorButtonClickedState(editorButtonClickedState ? false : true);
  }
  
  function clickedAddButton(){
    // Changes buttonClickedState and shows or closes the form editor
    const value = document.getElementById("addButton").innerHTML;
    value == "Add Address" ?  document.getElementById("addButton").innerHTML = "Cancel" : 
      document.getElementById("addButton").innerHTML = "Add Address";
    changeEditorButtonClickedState(editorButtonClickedState ? false : true);
  }

  return (
  <div className={styles.card}>
    <div className={`flex flex-wrap justify-between items-center`}>
      <div className="mb-4 md:mb-0">
        {children}
      </div>
      <div >
        {add ? 
          <button className={`mr-2 ${styles.button} ${styles[`button--secondary`]}`} 
            onClick={clickedAddButton} id="addButton">Add Address</button>
        : 
          <>
            <button className={`mr-2 ${styles.button} ${styles[`button--secondary`]}`} 
            onClick={clickedEditButton} id={`editButton${id}`}>Edit</button>
            <button className={`mr-2 ${styles.button} ${styles[`button--error`]}`} 
            onClick={deleteAddress} id="deleteButton">Delete</button>
          </>
        }
      </div>
    </div>
    {/* Shows form editor if Add/Edit button was clicked */}
    {editorButtonClickedState &&
      <div className={`border-2 border-purple p-8 mt-8 w-full md:w-1/2 }`}>
        <form onSubmit={saveForm}>
          <Input inputLabel="Address Line 1:" name="line1" required="true"></Input>
          <Input inputLabel="Address Line 2 (optional):" name="line2"></Input>
          <Input inputLabel="City:" name="city" required="true"></Input>
          <Input inputLabel="State:" name="state" required="true" 
            pattern="[A-Za-z]{2}" title="State should contain 2 letters, e.g. CA"></Input>
          <Input inputLabel="Zip Code:" name="zip" required="true" 
            pattern="[0-9]{5}" title="Zip Code should contain 5 digits, e.g. 12345"></Input>
          <button className={`mr-2 ${styles.button} ${styles[`button--primary`]}`} 
             id="saveButton" type="submit">Save</button>
        </form>
      </div>
    }
  </div>
  )
}
