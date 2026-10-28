// Manager Chat mock data - sample messages per channel
export const mockMessages = {
  1: [
    { id: 1, sender: 'John Admin', role: 'admin', text: 'Q3 targets are finalized. Please review and share feedback.', time: '10:00 AM', mine: false },
    { id: 2, sender: 'Rahul Manager', role: 'manager', text: 'Thanks John. I will review the engineering targets today.', time: '10:05 AM', mine: true },
    { id: 3, sender: 'Priya HR', role: 'hr', text: 'HR targets look good. We are on track.', time: '10:15 AM', mine: false },
    { id: 4, sender: 'John Admin', role: 'admin', text: 'Great. Let us meet at 3 PM to discuss.', time: '10:20 AM', mine: false },
    { id: 5, sender: 'Rahul Manager', role: 'manager', text: 'Confirmed, I will join the meeting.', time: '10:22 AM', mine: true },
    { id: 6, sender: 'Ravi Kumar', role: 'developer', text: 'Engineering capacity is at 90% for Q3.', time: '10:25 AM', mine: false },
    { id: 7, sender: 'Rahul Manager', role: 'manager', text: 'Noted. Will adjust if needed.', time: '10:28 AM', mine: true },
    { id: 8, sender: 'John Admin', role: 'admin', text: 'Q3 targets reviewed. Good work team.', time: '10:30 AM', mine: false },
  ],
  2: [
    { id: 1, sender: 'Priya HR', role: 'hr', text: 'Leave policy has been updated. Please review the new guidelines.', time: '09:00 AM', mine: false },
    { id: 2, sender: 'Rahul Manager', role: 'manager', text: 'Thanks Priya. I will share it with my team.', time: '09:05 AM', mine: true },
    { id: 3, sender: 'Anita Patel', role: 'hr', text: 'Effective date is 1st of next month.', time: '09:10 AM', mine: false },
    { id: 4, sender: 'Priya HR', role: 'hr', text: 'Yes. Let me know if anyone needs clarification.', time: '09:12 AM', mine: false },
    { id: 5, sender: 'Rahul Manager', role: 'manager', text: 'Will do. Already shared in the team group.', time: '09:15 AM', mine: true },
  ],
  3: [
    { id: 1, sender: 'Ravi Kumar', role: 'developer', text: 'Build passed all unit tests. Ready for code review.', time: 'Yesterday', mine: false },
    { id: 2, sender: 'Rahul Manager', role: 'manager', text: 'Great. Assign a reviewer from the senior team.', time: 'Yesterday', mine: true },
    { id: 3, sender: 'Kiran Das', role: 'developer', text: 'I can review the authentication module.', time: 'Yesterday', mine: false },
    { id: 4, sender: 'Ravi Kumar', role: 'developer', text: 'Perfect. Kiran, thank you. PR will be up in 1 hour.', time: 'Yesterday', mine: false },
    { id: 5, sender: 'Rahul Manager', role: 'manager', text: 'Keep me posted on the progress.', time: 'Yesterday', mine: true },
    { id: 6, sender: 'Ravi Kumar', role: 'developer', text: 'PR is up. Please review when you can.', time: 'Yesterday', mine: false },
    { id: 7, sender: 'Rahul Manager', role: 'manager', text: 'Will review by end of day.', time: 'Yesterday', mine: true },
    { id: 8, sender: 'Ravi Kumar', role: 'developer', text: 'Thanks Rahul. Ping me if any questions.', time: 'Yesterday', mine: false },
  ],
};