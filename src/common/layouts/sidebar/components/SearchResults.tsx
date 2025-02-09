import { Box } from '@chakra-ui/react';
import { HitsProvided } from 'react-instantsearch-core';
import { connectHits } from 'react-instantsearch-dom';
import { useMatch, useNavigate } from 'react-router-dom';

import { useSmallScreen } from 'lib/hooks/useSmallScreen';

import { Card } from './Card';

type CourseRecord = {
  pid: string;
  subject: string;
  title: string;
  code: string;
};

type Props = { term: string } & HitsProvided<CourseRecord>;

const SearchResults = ({ hits, term }: Props) => {
  const scheduleMatch = useMatch('/scheduler/*');
  const smallScreen = useSmallScreen();
  const navigate = useNavigate();

  // Sort the search hits by subject, then course code
  const sortedHits = hits.sort((a, b) => {
    if (a.subject === b.subject) {
      return a.code.localeCompare(b.code);
    }
    return a.subject.localeCompare(b.subject);
  });

  return (
    <>
      {sortedHits.map(({ objectID, pid, subject, code, title }) =>
        scheduleMatch ? (
          <Card subject={subject} title={title} pid={pid} code={code} schedule />
        ) : (
          <Box
            // to={`/calendar/${term}/${subject}?pid=${pid}`}
            onClick={() => {
              navigate(`/calendar/${term}/${subject}?pid=${pid}`);
              smallScreen && window.location.reload();
            }} // i do not like this, how else can we empty the search query onClick
            data-pid={pid}
            key={objectID}
          >
            <Card subject={subject} title={title} pid={pid} code={code} />
          </Box>
        )
      )}
    </>
  );
};

export const CustomHits = connectHits<Props, CourseRecord>(SearchResults);
