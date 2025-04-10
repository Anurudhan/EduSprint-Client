import { IChat, IMessage, SignupFormData, ChatType, ChatStatus, contentType, SubscriptionType } from '../../types';
import { Gender, Profession, Role } from '../../types'; // Assuming enums are in a separate file

// Mock Users with full SignupFormData
export const users: SignupFormData[] = [
  {
    _id: 'user1',
    email: 'john@example.com',
    password: 'hashedpassword1',
    confirmPassword: 'hashedpassword1',
    firstName: 'John',
    lastName: 'Doe',
    userName: 'johndoe',
    profile: {
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      dateOfBirth: '1990-05-15',
      gender: Gender.Male,
    },
    contact: {
      phone: '+1-555-0101',
      social: '@johndoe',
      address: '123 Main St, New York, NY 10001',
    },
    profession: Profession.Working,
    qualification: 'Bachelor of Science in Computer Science',
    role: Role.Student,
    profit: '500',
    isGAuth: false,
    cv: 'https://example.com/cv/john_doe.pdf',
    isVerified: true,
    isRejected: false,
    isRequested: false,
    createdAt: new Date(Date.now() - 86400000 * 30),
    isOtpVerified: true,
    isBlocked: false,
    chatId: 'chat1',
    roomId: 'room1',
    lastLoginDate: new Date(Date.now() - 3600000),
    loginStreak: 5,
    lastSeen: new Date(),
    isOnline: true,
    weeklyLogins: [true, true, false, true, true, false, true],
  },
  {
    _id: 'user2',
    email: 'jane@example.com',
    password: 'hashedpassword2',
    confirmPassword: 'hashedpassword2',
    firstName: 'Jane',
    lastName: 'Smith',
    userName: 'janesmith',
    profile: {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      dateOfBirth: '1992-08-22',
      gender: Gender.Female,
    },
    contact: {
      phone: '+1-555-0102',
      social: '@janesmith',
      address: '456 Oak Ave, Boston, MA 02108',
    },
    profession: Profession.Working,
    qualification: 'Master of Business Administration',
    role: Role.Instructor,
    profit: '750',
    isGAuth: true,
    cv: 'https://example.com/cv/jane_smith.pdf',
    isVerified: true,
    isRejected: false,
    isRequested: false,
    createdAt: new Date(Date.now() - 86400000 * 28),
    isOtpVerified: true,
    isBlocked: false,
    chatId: 'chat2',
    roomId: 'room2',
    lastLoginDate: new Date(Date.now() - 1800000),
    loginStreak: 3,
    lastSeen: new Date(),
    isOnline: true,
    weeklyLogins: [true, false, true, true, false, true, true],
  },
  {
    _id: 'user3',
    email: 'alex@example.com',
    password: 'hashedpassword3',
    confirmPassword: 'hashedpassword3',
    firstName: 'Alex',
    lastName: 'Johnson',
    userName: 'alexjohnson',
    profile: {
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      dateOfBirth: '1988-11-30',
      gender: Gender.Male,
    },
    contact: {
      phone: '+1-555-0103',
      social: '@alexjohnson',
      address: '789 Pine Rd, Chicago, IL 60601',
    },
    profession: Profession.Student,
    qualification: 'High School Diploma',
    role: Role.Student,
    profit: '200',
    isGAuth: false,
    cv: 'https://example.com/cv/alex_johnson.pdf',
    isVerified: true,
    isRejected: false,
    isRequested: false,
    createdAt: new Date(Date.now() - 86400000 * 25),
    isOtpVerified: true,
    isBlocked: false,
    chatId: 'chat3',
    roomId: 'room3',
    lastLoginDate: new Date(Date.now() - 7200000),
    loginStreak: 1,
    lastSeen: new Date(Date.now() - 3600000),
    isOnline: false,
    weeklyLogins: [false, true, false, false, true, false, false],
  },
  {
    _id: 'user4',
    email: 'marketing@example.com',
    password: 'hashedpassword4',
    confirmPassword: 'hashedpassword4',
    firstName: 'Marketing',
    lastName: 'Team',
    userName: 'marketingteam',
    profile: {
      avatar: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      gender: Gender.Other,
    },
    contact: {
      phone: '+1-555-0104',
      social: '@marketingteam',
      address: '101 Corporate Way, San Francisco, CA 94105',
    },
    profession: Profession.Working,
    qualification: 'Various',
    role: Role.Admin,
    profit: '1000',
    isGAuth: true,
    cv: 'https://example.com/cv/marketing_team.pdf',
    isVerified: true,
    isRejected: false,
    isRequested: false,
    createdAt: new Date(Date.now() - 86400000 * 20),
    isOtpVerified: true,
    isBlocked: false,
    chatId: 'chat3',
    roomId: 'room4',
    lastLoginDate: new Date(Date.now() - 900000),
    loginStreak: 7,
    lastSeen: new Date(),
    isOnline: true,
    weeklyLogins: [true, true, true, true, true, true, true],
  },
  {
    _id: 'user5',
    email: 'sarah@example.com',
    password: 'hashedpassword5',
    confirmPassword: 'hashedpassword5',
    firstName: 'Sarah',
    lastName: 'Williams',
    userName: 'sarahwilliams',
    profile: {
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      dateOfBirth: '1995-03-10',
      gender: Gender.Female,
    },
    contact: {
      phone: '+1-555-0105',
      social: '@sarahwilliams',
      address: '321 Elm St, Seattle, WA 98101',
    },
    profession: Profession.Student,
    qualification: 'Bachelor of Arts in Design',
    role: Role.Student,
    profit: '300',
    isGAuth: false,
    cv: 'https://example.com/cv/sarah_williams.pdf',
    isVerified: true,
    isRejected: false,
    isRequested: false,
    createdAt: new Date(Date.now() - 86400000 * 15),
    isOtpVerified: true,
    isBlocked: false,
    chatId: 'chat4',
    roomId: 'room5',
    lastLoginDate: new Date(Date.now() - 5400000),
    loginStreak: 2,
    lastSeen: new Date(Date.now() - 1800000),
    isOnline: false,
    weeklyLogins: [true, false, true, false, false, true, false],
  },
];

// Mock Chats (complete as before)
export const chats: IChat[] = [
  {
    _id: 'chat1',
    chatType: ChatType.individual,
    status: ChatStatus.active,
    subscriptionType: SubscriptionType.premium,
    participants: ['user1', 'user2'],
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(),
    isActive: true,
    lastMessage: {
      messageId: 'msg4',
      content: 'Looking forward to our meeting tomorrow!',
      sender: 'user2',
      timestamp: new Date(Date.now() - 3600000),
    },
    unreadCount: [
      { userId: 'user1', count: 1 },
      { userId: 'user2', count: 0 },
    ],
  },
  {
    _id: 'chat2',
    chatType: ChatType.group,
    status: ChatStatus.active,
    subscriptionType: SubscriptionType.standard,
    participants: ['user1', 'user2', 'user3'],
    admins: ['user1'],
    name: 'Project Discussion',
    avatar: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: new Date(Date.now() - 86400000 * 14),
    updatedAt: new Date(Date.now() - 7200000),
    isActive: true,
    lastMessage: {
      messageId: 'msg8',
      content: "I've updated the project timeline",
      sender: 'user3',
      timestamp: new Date(Date.now() - 7200000),
    },
    unreadCount: [
      { userId: 'user1', count: 2 },
      { userId: 'user2', count: 0 },
      { userId: 'user3', count: 0 },
    ],
  },
  {
    _id: 'chat3',
    chatType: ChatType.group,
    status: ChatStatus.active,
    subscriptionType: SubscriptionType.premium,
    participants: ['user1', 'user3', 'user4', 'user5'],
    admins: ['user4', 'user1'],
    name: 'Marketing Team',
    avatar: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: new Date(Date.now() - 86400000 * 30),
    updatedAt: new Date(Date.now() - 14400000),
    isActive: true,
    lastMessage: {
      messageId: 'msg12',
      content: 'New campaign assets are ready for review',
      sender: 'user4',
      timestamp: new Date(Date.now() - 14400000),
    },
    unreadCount: [
      { userId: 'user1', count: 5 },
      { userId: 'user3', count: 0 },
      { userId: 'user4', count: 0 },
      { userId: 'user5', count: 3 },
    ],
  },
  {
    _id: 'chat4',
    chatType: ChatType.individual,
    status: ChatStatus.active,
    subscriptionType: SubscriptionType.basic,
    participants: ['user1', 'user5'],
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 43200000),
    isActive: true,
    lastMessage: {
      messageId: 'msg15',
      content: 'Can you review my presentation?',
      sender: 'user5',
      timestamp: new Date(Date.now() - 43200000),
    },
    unreadCount: [
      { userId: 'user1', count: 1 },
      { userId: 'user5', count: 0 },
    ],
  },
];

// Mock Messages (complete as before)
export const messages: Record<string, IMessage[]> = {
  'chat1': [
    {
      _id: 'msg1',
      chatId: 'chat1',
      sender: 'user1',
      content: 'Hey Jane, how are you doing?',
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 86400000) },
        { userId: 'user2', readAt: new Date(Date.now() - 86390000) },
      ],
      reactions: [{ userId: 'user2', emoji: '👍' }],
    },
    {
      _id: 'msg2',
      chatId: 'chat1',
      sender: 'user2',
      content: "Hi John! I'm doing great, thanks for asking. How about you?",
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 86300000),
      updatedAt: new Date(Date.now() - 86300000),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 86290000) },
        { userId: 'user2', readAt: new Date(Date.now() - 86300000) },
      ],
      reactions: [{ userId: 'user1', emoji: '😊' }],
    },
    {
      _id: 'msg3',
      chatId: 'chat1',
      sender: 'user1',
      content: "I'm good too! Just preparing for our meeting tomorrow.",
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 7200000) },
        { userId: 'user2', readAt: new Date(Date.now() - 7190000) },
      ],
      reactions: [],
    },
    {
      _id: 'msg4',
      chatId: 'chat1',
      sender: 'user2',
      content: 'Looking forward to our meeting tomorrow!',
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
      isEdited: false,
      isDeleted: false,
      readBy: [{ userId: 'user2', readAt: new Date(Date.now() - 3600000) }],
      reactions: [],
    },
  ],
  'chat2': [
    {
      _id: 'msg5',
      chatId: 'chat2',
      sender: 'user1',
      content: 'Welcome to the project discussion group!',
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 86400000 * 14),
      updatedAt: new Date(Date.now() - 86400000 * 14),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 86400000 * 14) },
        { userId: 'user2', readAt: new Date(Date.now() - 86400000 * 14) },
        { userId: 'user3', readAt: new Date(Date.now() - 86400000 * 14) },
      ],
      reactions: [
        { userId: 'user2', emoji: '🎉' },
        { userId: 'user3', emoji: '🎉' },
      ],
    },
    {
      _id: 'msg6',
      chatId: 'chat2',
      sender: 'user2',
      content: 'Thanks for setting this up, John!',
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 86400000 * 14 + 3600000),
      updatedAt: new Date(Date.now() - 86400000 * 14 + 3600000),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 86400000 * 14 + 3610000) },
        { userId: 'user2', readAt: new Date(Date.now() - 86400000 * 14 + 3600000) },
        { userId: 'user3', readAt: new Date(Date.now() - 86400000 * 14 + 3620000) },
      ],
      reactions: [],
    },
    {
      _id: 'msg7',
      chatId: 'chat2',
      sender: 'user1',
      content: "Here's the project timeline document",
      contentType: contentType.file,
      fileUrl: 'https://example.com/files/project-timeline.pdf',
      createdAt: new Date(Date.now() - 86400000 * 7),
      updatedAt: new Date(Date.now() - 86400000 * 7),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 86400000 * 7) },
        { userId: 'user2', readAt: new Date(Date.now() - 86400000 * 7 + 1800000) },
        { userId: 'user3', readAt: new Date(Date.now() - 86400000 * 7 + 3600000) },
      ],
      reactions: [
        { userId: 'user2', emoji: '👍' },
        { userId: 'user3', emoji: '🙏' },
      ],
    },
    {
      _id: 'msg8',
      chatId: 'chat2',
      sender: 'user3',
      content: "I've updated the project timeline",
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user2', readAt: new Date(Date.now() - 7100000) },
        { userId: 'user3', readAt: new Date(Date.now() - 7200000) },
      ],
      reactions: [],
    },
  ],
  'chat3': [
    {
      _id: 'msg9',
      chatId: 'chat3',
      sender: 'user4',
      content: 'Welcome to the Marketing Team group!',
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 86400000 * 30),
      updatedAt: new Date(Date.now() - 86400000 * 30),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 86400000 * 30 + 3600000) },
        { userId: 'user3', readAt: new Date(Date.now() - 86400000 * 30 + 7200000) },
        { userId: 'user4', readAt: new Date(Date.now() - 86400000 * 30) },
        { userId: 'user5', readAt: new Date(Date.now() - 86400000 * 30 + 1800000) },
      ],
      reactions: [
        { userId: 'user1', emoji: '👋' },
        { userId: 'user3', emoji: '👋' },
        { userId: 'user5', emoji: '👋' },
      ],
    },
    {
      _id: 'msg10',
      chatId: 'chat3',
      sender: 'user4',
      content: 'Check out our new brand guidelines',
      contentType: contentType.file,
      fileUrl: 'https://example.com/files/brand-guidelines.pdf',
      createdAt: new Date(Date.now() - 86400000 * 20),
      updatedAt: new Date(Date.now() - 86400000 * 20),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 86400000 * 20 + 3600000) },
        { userId: 'user3', readAt: new Date(Date.now() - 86400000 * 20 + 1800000) },
        { userId: 'user4', readAt: new Date(Date.now() - 86400000 * 20) },
        { userId: 'user5', readAt: new Date(Date.now() - 86400000 * 20 + 7200000) },
      ],
      reactions: [
        { userId: 'user3', emoji: '👍' },
        { userId: 'user5', emoji: '❤️' },
      ],
    },
    {
      _id: 'msg11',
      chatId: 'chat3',
      sender: 'user5',
      content: "Here's a preview of the new campaign visuals",
      contentType: contentType.image,
      fileUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      createdAt: new Date(Date.now() - 86400000 * 10),
      updatedAt: new Date(Date.now() - 86400000 * 10),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user3', readAt: new Date(Date.now() - 86400000 * 10 + 1800000) },
        { userId: 'user4', readAt: new Date(Date.now() - 86400000 * 10 + 900000) },
        { userId: 'user5', readAt: new Date(Date.now() - 86400000 * 10) },
      ],
      reactions: [
        { userId: 'user3', emoji: '🔥' },
        { userId: 'user4', emoji: '👏' },
      ],
    },
    {
      _id: 'msg12',
      chatId: 'chat3',
      sender: 'user4',
      content: 'New campaign assets are ready for review',
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 14400000),
      updatedAt: new Date(Date.now() - 14400000),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user3', readAt: new Date(Date.now() - 14300000) },
        { userId: 'user4', readAt: new Date(Date.now() - 14400000) },
      ],
      reactions: [{ userId: 'user3', emoji: '👍' }],
    },
  ],
  'chat4': [
    {
      _id: 'msg13',
      chatId: 'chat4',
      sender: 'user1',
      content: 'Hi Sarah, do you have time to chat about the presentation?',
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 86400000 * 2),
      updatedAt: new Date(Date.now() - 86400000 * 2),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 86400000 * 2) },
        { userId: 'user5', readAt: new Date(Date.now() - 86400000 * 2 + 1800000) },
      ],
      reactions: [],
    },
    {
      _id: 'msg14',
      chatId: 'chat4',
      sender: 'user5',
      content: "Sure, I'm available tomorrow afternoon. Would 2 PM work for you?",
      contentType: contentType.text,
      createdAt: new Date(Date.now() - 86400000 * 2 + 3600000),
      updatedAt: new Date(Date.now() - 86400000 * 2 + 3600000),
      isEdited: false,
      isDeleted: false,
      readBy: [
        { userId: 'user1', readAt: new Date(Date.now() - 86400000 * 2 + 3700000) },
        { userId: 'user5', readAt: new Date(Date.now() - 86400000 * 2 + 3600000) },
      ],
      reactions: [{ userId: 'user1', emoji: '👍' }],
    },
    {
      _id: 'msg15',
      chatId: 'chat4',
      sender: 'user5',
      content: 'Can you review my presentation?',
      contentType: contentType.file,
      fileUrl: 'https://example.com/files/presentation.pptx',
      createdAt: new Date(Date.now() - 43200000),
      updatedAt: new Date(Date.now() - 43200000),
      isEdited: false,
      isDeleted: false,
      readBy: [{ userId: 'user5', readAt: new Date(Date.now() - 43200000) }],
      reactions: [],
    },
  ],
};

// Current user
export const currentUser: SignupFormData = users[0]; // user1 (John Doe)