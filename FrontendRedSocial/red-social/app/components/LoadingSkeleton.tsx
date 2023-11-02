import { CardBody, CardFooter, CardHeader, Card, Skeleton } from "@nextui-org/react"
export default function LoadingSkeleton() {
  return (

    <Card className="max-w-[750px] hover:bg-zinc-900 bg-black border-b-1 border-zinc-600 rounded-none ">


      <CardHeader >
        <div className="flex  gap-5">
          <Skeleton className="rounded-full w-12 h-12" />
          <Skeleton className="h-3 w-24  rounded-lg" />
        </div>
      </CardHeader >

      <CardBody className="px-3 py-0 text-small  text-white">
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </CardBody>
      <CardFooter className="gap-3">
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </CardFooter>
    </Card>

  )
}
