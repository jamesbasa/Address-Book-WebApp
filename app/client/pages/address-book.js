import Head from 'next/head'
import Layout from '../components/layout/layout'
import Input from '../components/input/input'
import Card from '../components/card/card'
import buttonStyles from '../components/button/button.module.scss'
import { useState } from 'react';


export default function Home( {initialAddresses} ) {

  // Declares new state variable to keep track of addresses state changes
  const [addressesState, changeAddressesState] = useState(Array.from(initialAddresses));

  async function searchAddress(event) {
    event.preventDefault();

    try {
      // Calls server's API endpoint to search the address from the form input
      // Contains method, headers, and body
      const res = await fetch('http://localhost:3001/addresses/search', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchInput: event.target.searchInput.value
        })
      });
      const searchResult = await res.json();
      // Re-renders after search result changes the state
      changeAddressesState(searchResult.searchResult);
    }
    catch(err) {
      console.log(err);
    }
  }
  
  return (
    <Layout home>
      <Head>
        <title>Address Book</title>
      </Head>
      <h1 className="mb-8">Address Book</h1>
      <div className="w-full md:w-1/2">
        {/* Form for searching addresses */}
        <form onSubmit={searchAddress}>
          <Input 
            icon="icon-search.svg" inputLabel="Search Addresses:" name="searchInput">
          </Input>
          <button className={`mr-2 ${buttonStyles.button} ${buttonStyles[`button--primary`]}`} 
             id="searchButton" type="submit" icon="icon-search.svg">Search</button>
        </form>
      </div>
      <div className="mt-10">
        <Card edit={false} add={true}>
          <p className="text-lg">Add a New User's Address</p>
        </Card>
        {/* Shows address Cards if there are any */}
        {(addressesState == undefined || addressesState == null || addressesState.length == 0) ?
          <p></p>
        :
          addressesState.map(addr => <Card id={addr.id} edit={true} add={false}>
            {/*<p>{addr.id}</p>*/}
            <p>{addr.line1} {addr.line2}, {addr.city}, {addr.state} {addr.zip}</p></Card>)
        }
      </div>
    </Layout>
  )
}

// This function gets called at build time on server-side
export async function getStaticProps() {
  // Calls server's API endpoint to get all addresses
  const res = await fetch('http://server:3001/addresses');
  const data = await res.json();
  const initialAddresses = data.addresses;

  // Home component will receive `initialAddresses` as a prop at build time
  return {
    props: {
      initialAddresses
    },
  }
}
