import type { ReactNode } from 'react';

import Action from './Action';
import Checkbox from './Checkbox';
import DatePicker from './DatePicker';
import Dropdown from './Dropdown';
import FilePicker from './File';
import LazyHTMLEditor from './html/LazyHTMLEditor';
import ImagePicker from './Image';
import Radio from './Radio';
import Section from './Section';
import Text from './Text';
import TextArea from './TextArea';
import TextList from './TextList';

// TODO: https://reactrouter.com/how-to/navigation-blocking
function Form({ children }: { children: ReactNode }) {
  return <form className="flex flex-col">{children}</form>;
}

export default Object.assign(Form, {
  Action,
  Image: ImagePicker,
  File: FilePicker,
  Text,
  TextList,
  Checkbox,
  Radio,
  Dropdown,
  Section,
  TextArea,
  HTML: LazyHTMLEditor,
  Date: DatePicker,
});
