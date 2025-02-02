import Container from '../../components/Container'

// @ts-ignore TYPE NEEDS FIXING
export default function AnalyticsContainer({ children }): JSX.Element {
  return (
    <>
      <Container
        id="analytics"
        maxWidth="full"
        className="grid h-full grid-flow-col bg-dark-1000 grid-cols-10 mx-auto lg:px-4 gap- mt-4 sm:mt-6"
      >
        <div className="col-span-10 lg:col-span-full 3xl:col-span-7">{children}</div>
      </Container>
    </>
  )
}