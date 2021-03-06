import React from 'react'
import Card from '../../components/Card'
import Typography from '../../components/Typography'
import Image from '../../components/Image'

export const AboutProjectTab = ({ project }) => {
  return (
    <div className="bg-light-glass md:bg-transparent md:px-0 px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 space-y-10 md:space-y-0 md:space-x-10">
        <div className="grid grid-cols-1 space-y-4 items-center">
          <div className="flex flex-col">
            <Typography variant="h1" className="font-bold">
              Project Highlights
            </Typography>
            <br/>
            <ul className="mt-1 list-outside list-disc space-y-2 text-md font-regular">
              {project.highlights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-1 space-y-4 justify-items-end">
          <div className="flex flex-col">
            <Image alt={''} width={400} height={400} className={'rounded'} src={project.image} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 mt-10">
        <div className="grid grid-cols-1 space-y-4">
          {/* <div className="flex flex-col">
            <Typography variant="h1" className="font-bold">
              Product
            </Typography>
            <Typography variant="lg" className="">
              {project.description}
            </Typography>
          </div> */}
        </div>
        <div className="grid md:grid-cols-1 gap-10 mt-10">
          <Card
            className="border py-2 px-4"
            // removePadding
            header={
              <Typography variant="lg" className="mb-2 font-bold">
                Socials
              </Typography>
            }
          >
            {project.socials.map((p, i) => (
              <div
                key={i}
                className="grid justify-center py-1 grid-cols-2 border border-t-0 border-r-0 border-l-0 border-thin border-dark-600"
              >
                <div>{p.title}</div>
                <a className="col-span-2" href={p.link} target="_blank" rel="noreferrer">
                  {p.link}
                </a>
              </div>
            ))}
          </Card>
          <Card
            className="border py-2 px-4"
            // removePadding
            header={
              <Typography variant="lg" className="mb-2 font-bold">
                Token Details
              </Typography>
            }
          >
            {project.details.map((p, i) => (
              <div
                key={i}
                className="grid  justify-center py-1 grid-cols-2 border border-t-0 border-r-0 border-l-0 border-thin border-dark-600"
              >
                <div>{p.title}</div>
                <div>{p.description}</div>
              </div>
            ))}
          </Card>
          <Card
            className="border py-2 px-4"
            // removePadding
            header={
              <Typography variant="lg" className="mb-2 font-bold">
                Tokenomics
              </Typography>
            }
          >
            {project.tokenomics.map((p, i) => (
              <div
                key={i}
                className="grid  justify-center py-1 grid-cols-2 border border-t-0 border-r-0 border-l-0 border-thin border-dark-600"
              >
                <div>{p.title}</div>
                <div>{p.description}</div>
              </div>
            ))}
          </Card>
          <Card
            className="border py-2 px-4"
            // removePadding
            header={
              <Typography variant="lg" className="mb-2 font-bold">
                Launch Details
              </Typography>
            }
          >
            {project.ido.map((p, i) => (
              <div
                key={i}
                className="grid  justify-center py-1 grid-cols-2 border border-t-0 border-r-0 border-l-0 border-thin border-dark-600"
              >
                <div>{p.title}</div>
                <div>{p.description}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
