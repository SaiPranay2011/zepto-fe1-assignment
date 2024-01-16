import Assignnment from "@/components/multiSelect/assignment";
import userData from "@/hooks/userData";


export default async function Home() {
  const data = await userData()
  return (
    <main className="h-screen w-screen">
      <Assignnment data={data}/>
    </main>
  )
}
