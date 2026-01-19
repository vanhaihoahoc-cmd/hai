
import { Exam } from './types';

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'chem-01',
    title: 'Đề ôn tập Hóa học THPT số 1',
    subject: 'Hóa học',
    duration: 50,
    questions: [
      {
        id: 'c1',
        text: 'Chất nào sau đây thuộc loại este no, đơn chức, mạch hở?',
        options: ['CH3COOC2H5', 'CH2=CHCOOCH3', 'C6H5COOCH3', 'HCOOCH2C6H5'],
        correctAnswer: 0,
      },
      {
        id: 'c2',
        text: 'Thủy phân hoàn toàn 1 mol saccarozơ trong môi trường axit, thu được:',
        options: ['1 mol glucozơ và 1 mol fructozơ', '2 mol glucozơ', '2 mol fructozơ', '1 mol glucozơ và 1 mol mantozơ'],
        correctAnswer: 0,
      },
      {
        id: 'c3',
        text: 'Kim loại nào sau đây có tính dẫn điện tốt nhất?',
        options: ['Cu', 'Al', 'Ag', 'Au'],
        correctAnswer: 2,
      },
      {
        id: 'c4',
        text: 'Công thức phân tử của vinyl axetat là:',
        options: ['C4H6O2', 'C4H8O2', 'C3H4O2', 'C3H6O2'],
        correctAnswer: 0,
      }
    ]
  }
];
