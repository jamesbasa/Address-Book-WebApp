import Head from 'next/head'
import Layout from '../components/layout/layout'
import Link from 'next/link'

export default function Home( {} ) {
  return (
    <Layout home>
      <Head>
        <title>Overview</title>
      </Head>
      <h1>Overview</h1><br/>
      <p>Welcome to your address book home page!</p><br/>
      <p>Manage your address book at <Link href="/address-book"><a className="underline">Address Book</a>
        </Link> or check out data insights at <Link href="/analytics"><a className="underline">Analytics</a></Link>
      </p>
    </Layout>
  )
}