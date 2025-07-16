import Link from 'next/link';

export default function Home(){
  return (
    <div style={{padding: "30px", textAlign:"center"}}>
      <h1>Blog App</h1>
      <Link href="/auth/login">Go to login</Link>
    </div>
  );
}
