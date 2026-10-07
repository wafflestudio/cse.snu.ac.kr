import { Link } from '@tanstack/react-router';
import { FileText } from 'lucide-react';
import { Fragment } from 'react';
import type { SimpleResearchLab } from '@/types/api';
import YoutubeIcon from '../assets/youtube_icon.svg?react';

export default function ResearchLabListRow({
  lab,
  localizedPath,
  labelProfessor,
}: {
  lab: SimpleResearchLab;
  localizedPath: (path: string) => string;
  labelProfessor: string;
}) {
  const { id, name, professors, location, tel, acronym, pdf, youtube } = lab;
  const hasLocation = Boolean(location);
  const hasTel = Boolean(tel);
  const hasIntro = Boolean(pdf || youtube);

  return (
    <li className="grid-rows-auto grid grid-cols-[auto_1fr] items-end gap-2 bg-white sm:gap-x-6 sm:gap-y-0 px-6 py-6 type-ui tracking-[0.02em] odd:bg-neutral-50 sm:col-span-full sm:h-11 sm:grid-cols-subgrid sm:items-center sm:px-2 sm:py-0">
      <LabNameCell id={id} name={name} localizedPath={localizedPath} />
      <LabProfessorsCell
        professors={professors}
        localizedPath={localizedPath}
        labelProfessor={labelProfessor}
      />
      <span
        className={`${hasLocation ? '' : 'hidden sm:inline'} col-span-3 text-neutral-500 sm:col-span-1`}
      >
        {location}
      </span>
      <span className={`${hasTel ? '' : 'hidden sm:inline'} text-neutral-500`}>
        {tel}
      </span>
      <span
        className={`-order-2 col-span-2 row-span-1 text-main-orange sm:order-0 sm:col-span-1 sm:text-neutral-500`}
      >
        {acronym}
      </span>
      <LabMaterialsCell
        name={name}
        pdf={pdf}
        youtube={youtube}
        hasIntro={hasIntro}
      />
    </li>
  );
}

function LabNameCell({
  id,
  name,
  localizedPath,
}: {
  id: number;
  name: string;
  localizedPath: (path: string) => string;
}) {
  return (
    <span
      className={`order-first col-span-1 row-span-1 type-item sm:type-ui sm:whitespace-normal`}
    >
      <Link
        className="text-neutral-950 hover:text-main-orange-dark"
        to={localizedPath(`/research/labs/${id}`)}
      >
        {name}
      </Link>
    </span>
  );
}

function LabProfessorsCell({
  professors,
  localizedPath,
  labelProfessor,
}: {
  professors: { id: number; name: string }[];
  localizedPath: (path: string) => string;
  labelProfessor: string;
}) {
  return (
    <span className={`col-span-3 type-ui text-neutral-950 sm:col-span-1`}>
      <span className="sm:hidden">{labelProfessor}: </span>
      {professors.map((info, index) => (
        <Fragment key={info.id}>
          <Link
            to={localizedPath(`/people/faculty/${info.id}`)}
            className="hover:text-main-orange-dark"
          >
            {info.name}
          </Link>
          {index !== professors.length - 1 && ', '}
        </Fragment>
      ))}
    </span>
  );
}

function LabMaterialsCell({
  name,
  pdf,
  youtube,
  hasIntro,
}: {
  name: string;
  pdf: SimpleResearchLab['pdf'];
  youtube: SimpleResearchLab['youtube'];
  hasIntro: boolean;
}) {
  return (
    <span
      className={`${hasIntro ? '' : 'hidden sm:inline'} col-span-3 flex items-center gap-3 sm:col-span-1`}
    >
      {pdf && (
        <a
          href={pdf.url}
          download={`${name} 소개자료`}
          className="h-5"
          title="PDF"
        >
          <FileText className="size-5 text-neutral-500 hover:text-main-orange-dark" />
        </a>
      )}
      {youtube && (
        <a href={youtube} className="h-5 py-1" title="YOUTUBE">
          <YoutubeIcon className="fill-neutral-500 hover:fill-main-orange-dark" />
        </a>
      )}
    </span>
  );
}
