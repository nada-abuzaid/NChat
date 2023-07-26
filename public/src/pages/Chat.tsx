import { ChatItem } from 'react-chat-elements';

export default function Chat() {
  return (
    <ChatItem
      avatar={'https://facebook.github.io/react/img/logo.svg'}
      alt={'Reactjs'}
      title={'Facebook'}
      subtitle={'What are you doing?'}
      date={new Date()}
      unread={0}
    />
  );
}
