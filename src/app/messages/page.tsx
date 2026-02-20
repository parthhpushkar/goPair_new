'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSend, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import { getInitials, timeAgo } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedUserId = searchParams.get('userId');

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (session) {
      if (selectedUserId) {
        fetchMessages(selectedUserId);
      }
      fetchConversations();
    }
  }, [session, status, selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedUserId,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages(selectedUserId);
        fetchConversations();
      }
    } catch (error) {
      console.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (status === 'loading' || loading) return <LoadingSpinner text="Loading messages..." />;
  if (!session) return null;

  const currentUserId = (session.user as any).id;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FiMessageSquare className="text-primary-400" /> Messages
        </h1>

        <div className="glass-card overflow-hidden" style={{ minHeight: '60vh' }}>
          <div className="flex h-[65vh]">
            {/* Conversations List */}
            <div
              className={`w-full md:w-80 border-r border-white/5 flex flex-col ${
                selectedUserId ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="p-4 border-b border-white/5">
                <h2 className="font-semibold text-white text-sm">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <button
                      key={conv.user.id}
                      onClick={() => router.push(`/messages?userId=${conv.user.id}`)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all text-left ${
                        selectedUserId === conv.user.id ? 'bg-white/5' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {getInitials(conv.user.name || 'U')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white truncate">
                            {conv.user.name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {timeAgo(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 text-sm">No conversations yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`flex-1 flex flex-col ${
                selectedUserId ? 'flex' : 'hidden md:flex'
              }`}
            >
              {selectedUserId ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/5 flex items-center gap-3">
                    <button
                      onClick={() => router.push('/messages')}
                      className="md:hidden text-gray-400 hover:text-white"
                    >
                      <FiArrowLeft />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                      {getInitials(
                        conversations.find((c) => c.user.id === selectedUserId)?.user.name || 'U'
                      )}
                    </div>
                    <p className="font-medium text-white text-sm">
                      {conversations.find((c) => c.user.id === selectedUserId)?.user.name || 'User'}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => {
                      const isMine = msg.senderId === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                              isMine
                                ? 'bg-primary-600 text-white rounded-br-md'
                                : 'glass text-gray-200 rounded-bl-md'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p
                              className={`text-[10px] mt-1 ${
                                isMine ? 'text-primary-200' : 'text-gray-500'
                              }`}
                            >
                              {timeAgo(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={handleSend}
                    className="p-4 border-t border-white/5 flex gap-3"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="glass-input flex-1"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="glass-button py-2.5 px-5 disabled:opacity-50"
                    >
                      <FiSend />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FiMessageSquare className="mx-auto text-4xl text-gray-600 mb-3" />
                    <p className="text-gray-500">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
