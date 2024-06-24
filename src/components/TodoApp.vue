<template>
  <div>
    <h1>Student Attendance List</h1>
    <input v-model="newStudent.name" placeholder="Name" />
    <input v-model="newStudent.surname" placeholder="Surname" />
    <input v-model="newStudent.jmbag" placeholder="JMBAG" />
    <button @click="addStudent">Add Student</button>
    <ul>
      <li v-for="student in students" :key="student.id">
        <span @dblclick="editStudent(student)">{{ student.name }} {{ student.surname }} ({{ student.jmbag }})</span>
        <div>
          <button @click="editStudent(student)">Edit</button>
          <button @click="deleteStudent(student.id)">Delete</button>
        </div>
        <div v-if="student === editingStudent">
          <input v-model="student.name" placeholder="Name" />
          <input v-model="student.surname" placeholder="Surname" />
          <input v-model="student.jmbag" placeholder="JMBAG" />
          <button @click="updateStudent(student)">Update</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      students: [],
      newStudent: { name: '', surname: '', jmbag: '' },
      editingStudent: null
    }
  },
  methods: {
    async fetchStudents() {
      const response = await this.$axios.get('http://localhost:3000/students');
      this.students = response.data.data;
    },
    async addStudent() {
      if (!this.newStudent.name || !this.newStudent.surname || !this.newStudent.jmbag) return;
      try {
        await this.$axios.post('http://localhost:3000/students', this.newStudent);
        window.location.reload(); // Refresh the page after adding a student
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.error);
        } else {
          console.error(error);
        }
      }
    },
    async updateStudent(student) {
      try {
        await this.$axios.put(`http://localhost:3000/students/${student.id}`, student);
        window.location.reload(); // Refresh the page after updating a student
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.error);
        } else {
          console.error(error);
        }
      }
    },
    async deleteStudent(id) {
      await this.$axios.delete(`http://localhost:3000/students/${id}`);
      window.location.reload(); // Refresh the page after deleting a student
    },
    editStudent(student) {
      this.editingStudent = student;
    }
  },
  mounted() {
    this.fetchStudents();
  }
}
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}
</style>
