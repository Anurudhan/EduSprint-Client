import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  invoiceInfo: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  courseDetails: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  total: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 10,
  },
});

interface InvoicePDFProps {
  data: {
    _id: string;
    courseId: string;
    method: string;
    status: string;
    amount: number;
    createdAt: string;
    course: {
      title: string;
      description: string;
      level: string;
    };
    userName:string;
  };
}

export const InvoicePDF = ({ data }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Course Invoice</Text>
      </View>

      <View style={styles.invoiceInfo}>
        <View style={styles.row}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{data.userName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {format(new Date(data.createdAt), 'MMMM dd, yyyy')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{data.status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{data.method}</Text>
        </View>
      </View>

      <View style={styles.courseDetails}>
        <Text style={styles.sectionTitle}>Course Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{data.course.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{data.course.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Level:</Text>
          <Text style={styles.value}>{data.course.level}</Text>
        </View>
      </View>

      <View style={styles.total}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={styles.value}>₹{data.amount}</Text>
        </View>
      </View>
    </Page>
  </Document>
);