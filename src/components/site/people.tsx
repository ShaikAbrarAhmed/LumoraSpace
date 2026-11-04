import Image from "next/image"
import { COLLEGES, type TeamCard } from "@/data/company"

/** Partner colleges as a ruled list (students and colleges pages). */
export function CollegeList() {
  return (
    <ul
      className="m-0 grid list-none gap-x-10 border-t border-white/10 p-0"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))" }}
    >
      {COLLEGES.map((college) => (
        <li key={college.name} className="flex items-center gap-3.5 border-b border-white/10 py-4">
          <Image
            src={college.logo}
            alt={`${college.name} logo`}
            width={48}
            height={48}
            className="h-12 w-12 flex-none rounded-full bg-white object-contain"
          />
          <span className="flex flex-col">
            <span className="text-lg font-semibold text-ls-fg">{college.name}</span>
            <span className="text-[15px]">Partner institution · {college.place}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

/** The smaller inline version under the home page's education half. */
export function CollegeInline() {
  return (
    <div className="mt-1 flex flex-col gap-3">
      <span className="text-sm text-ls-faint">Partner colleges</span>
      <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-3.5 p-0">
        {COLLEGES.map((college) => (
          <li key={college.name} className="flex items-center gap-3">
            <Image
              src={college.logo}
              alt={`${college.name} logo`}
              width={40}
              height={40}
              className="h-10 w-10 flex-none rounded-full bg-white object-contain"
            />
            <span className="flex flex-col">
              <span className="text-[15px] font-semibold text-ls-fg">{college.name}</span>
              <span className="text-[13px] text-ls-body">{college.place}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Square portraits with name and role; a person without a photo gets their initial. */
export function TeamGrid({ people }: { people: TeamCard[] }) {
  return (
    <ul
      className="m-0 grid list-none gap-x-6 gap-y-8 p-0"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(170px, 100%), 1fr))" }}
    >
      {people.map((person) => (
        <li key={person.name} className="flex flex-col gap-2.5">
          {person.image ? (
            <div className="relative aspect-square overflow-hidden rounded-[6px] bg-ls-tile">
              <Image
                src={person.image}
                alt={person.name}
                fill
                sizes="(min-width: 1024px) 200px, 45vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              role="img"
              aria-label={`Photo placeholder: ${person.name}`}
              className="flex aspect-square items-center justify-center rounded-[6px] bg-ls-tile text-[40px] font-semibold text-[#3A3A3A]"
            >
              {person.name.charAt(0)}
            </div>
          )}
          <span className="text-lg font-semibold text-ls-fg">{person.name}</span>
          <span className="-mt-1.5 text-[15px]">{person.role}</span>
        </li>
      ))}
    </ul>
  )
}
