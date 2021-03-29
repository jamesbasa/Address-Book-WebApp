import Head from 'next/head'
import Layout from '../components/layout/layout'

export default function Home( {} ) {
  return (
    <Layout home>
      <Head>
        <title>Overview</title>
      </Head>
      <h1>Analytics</h1>
    </Layout>
  )
}