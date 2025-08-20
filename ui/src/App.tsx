'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Moon, Sun, Send, Loader2, BookOpen, Gavel, Scale, Trash2, Edit, Copy, Check, ChevronDown, ChevronUp, Mic, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from 'react-speech-recognition';

export default function App() {
  const [q, setQ] = useState('');
  const [ans, setAns] = useState('');
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{id: string, q: string, a: string, expanded?: boolean}>>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Categories for quick questions
  const categories = [
    {
      name: 'Property',
      questions: [
        'What are the laws regarding property inheritance in India?',
        'How to register a property in India?',
        'What is adverse possession in Indian law?'
      ]
    },
    {
      name: 'Criminal',
      questions: [
        'What is the procedure for filing an FIR in India?',
        'What are the rights of an arrested person in India?',
        'What is the punishment for theft under IPC?'
      ]
    },
    {
      name: 'Family',
      questions: [
        'What are the grounds for divorce in India?',
        'How is child custody determined in India?',
        'What are the laws about adoption in India?'
      ]
    }
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [q]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Handle speech recognition transcript
  useEffect(() => {
    if (isRecording) {
      setQ(transcript);
    }
  }, [transcript, isRecording]);

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const ask = async () => {
    if (!q.trim()) return;
    try {
      setLoading(true);
      const newId = generateId();
      // Add user question immediately
      setConversation(prev => [...prev, { id: newId, q: q.trim(), a: '', expanded: true }]);
      setQ('');
      
      const { data } = await axios.post('/api/query', { q });
      setAns(data.answer);
      setConversation(prev => prev.map(item => 
        item.id === newId ? { ...item, a: data.answer } : item
      ));
    } catch (e: any) {
      setConversation(prev => prev.map(item => 
        item.id === editingId ? { ...item, a: `❌ Error: ${e.message}` } : item
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  };

  const deleteMessage = (id: string) => {
    setConversation(prev => prev.filter(item => item.id !== id));
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = useCallback(() => {
    if (!editingId) return;
    
    setConversation(prev => prev.map(item => 
      item.id === editingId ? { ...item, a: editText } : item
    ));
    setEditingId(null);
    setEditText('');
  }, [editingId, editText]);

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setConversation(prev => prev.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const startRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }
    resetTranscript();
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const insertSampleQuestion = (question: string) => {
    setQ(question);
    textareaRef.current?.focus();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              <Scale className="w-8 h-8 text-indigo-600" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              NeethiSaarathi
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-full ${dark ? 'bg-gray-700 text-yellow-300' : 'bg-white text-gray-700'} shadow-md hover:shadow-lg transition-all`}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {conversation.length > 0 && (
              <button
                onClick={() => setConversation([])}
                className={`p-2 rounded-full ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} shadow-md transition-all`}
                aria-label="Clear conversation"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.header>

        {/* Main Content */}
        <div className={`rounded-3xl shadow-2xl overflow-hidden ${dark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Chat Header */}
          <div className={`p-6 ${dark ? 'bg-gray-700' : 'bg-indigo-600'} text-white flex items-center space-x-3`}>
            <Gavel className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Indian Law Assistant</h2>
            <div className="ml-auto flex space-x-2">
              {browserSupportsSpeechRecognition && (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : dark ? 'bg-gray-600' : 'bg-indigo-500'} transition-all`}
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
          
          {/* Conversation Area */}
          <div className={`h-96 overflow-y-auto p-6 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
            {conversation.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <BookOpen className="w-12 h-12 mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">Ask About Indian Law</h3>
                <p className={`max-w-md ${dark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                  Get accurate information about Indian legal matters. Try asking about property laws, criminal procedures, or constitutional rights.
                </p>
                
                {/* Quick questions by category */}
                <div className="w-full max-w-lg space-y-4">
                  {categories.map(category => (
                    <div key={category.name} className="text-left">
                      <button
                        onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                        className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                      >
                        <span className="font-medium">{category.name} Law</span>
                        {activeCategory === category.name ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      <AnimatePresence>
                        {activeCategory === category.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`mt-1 pl-4 pr-2 overflow-hidden ${dark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}
                          >
                            <div className="py-2 space-y-2">
                              {category.questions.map((question, i) => (
                                <button
                                  key={i}
                                  onClick={() => insertSampleQuestion(question)}
                                  className={`block w-full text-left px-3 py-2 rounded-md ${dark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors text-sm`}
                                >
                                  {question}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {conversation.map((item) => (
                    <div key={item.id} className="space-y-4">
                      {/* Question */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-end"
                      >
                        <div className={`max-w-3/4 px-4 py-3 rounded-2xl ${dark ? 'bg-indigo-700' : 'bg-indigo-100'} rounded-br-none relative group`}>
                          <p>{item.q}</p>
                          <div className={`absolute -left-2 top-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <button 
                              onClick={() => copyToClipboard(item.q, item.id)}
                              className="p-1 hover:bg-black/10 rounded"
                              title="Copy question"
                            >
                              {copiedId === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <button 
                              onClick={() => startEdit(item.id, item.q)}
                              className="p-1 hover:bg-black/10 rounded"
                              title="Edit question"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => deleteMessage(item.id)}
                              className="p-1 hover:bg-black/10 rounded"
                              title="Delete message"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Answer */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-start"
                      >
                        <div className={`max-w-3/4 px-4 py-3 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-gray-100'} rounded-bl-none relative group`}>
                          {editingId === item.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className={`w-full p-2 rounded-lg ${dark ? 'bg-gray-600 text-white' : 'bg-white'} border ${dark ? 'border-gray-600' : 'border-gray-300'}`}
                                rows={4}
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={cancelEdit}
                                  className={`px-3 py-1 rounded-lg ${dark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={saveEdit}
                                  className={`px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors`}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className={`whitespace-pre-wrap ${!item.expanded ? 'line-clamp-3' : ''}`}>
                                {item.a}
                              </div>
                              {item.a.length > 300 && (
                                <button
                                  onClick={() => toggleExpand(item.id)}
                                  className={`mt-2 text-sm ${dark ? 'text-indigo-300' : 'text-indigo-600'} hover:underline flex items-center`}
                                >
                                  {item.expanded ? 'Show less' : 'Show more'}
                                  {item.expanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                                </button>
                              )}
                              <div className={`absolute -right-2 top-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <button 
                                  onClick={() => copyToClipboard(item.a, item.id)}
                                  className="p-1 hover:bg-black/10 rounded"
                                  title="Copy answer"
                                >
                                  {copiedId === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </button>
                                <button 
                                  onClick={() => startEdit(item.id, item.a)}
                                  className="p-1 hover:bg-black/10 rounded"
                                  title="Edit answer"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => deleteMessage(item.id)}
                                  className="p-1 hover:bg-black/10 rounded"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className={`p-6 border-t ${dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask a question about Indian law..."
                value={isRecording ? transcript : q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full pr-16 py-3 px-4 rounded-xl resize-none focus:outline-none focus:ring-2 ${dark ? 'bg-gray-700 text-white focus:ring-indigo-500' : 'bg-white text-gray-900 focus:ring-indigo-300'} shadow-sm transition-all`}
              />
              <div className="absolute right-2 bottom-2 flex space-x-1">
                {browserSupportsSpeechRecognition && !isRecording && q.length === 0 && (
                  <button
                    onClick={startRecording}
                    className={`p-2 rounded-full ${dark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'} transition-colors`}
                    aria-label="Start recording"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={ask}
                  disabled={loading || !q.trim()}
                  className={`p-2 rounded-full ${loading || !q.trim() ? 'text-gray-400' : 'text-white bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <p className={`mt-2 text-sm text-center ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              NeethiSaarathi provides legal information, not professional advice
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by Indian Legal Knowledge Base • {new Date().getFullYear()}
          </p>
          <p className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Always verify with a qualified legal professional before taking action
          </p>
        </footer>
      </div>
    </div>
  );
}
