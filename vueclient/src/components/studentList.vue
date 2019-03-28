<template>
  <div class="adminList main">
    <div class="input_box">
      <input v-model="Student.name" class="myinput" type="text" placeholder="学员姓名">
      <input v-model="Student.age" class="myinput" type="text" placeholder="年龄">
      <input v-model="Student.gender" class="myinput" type="text" placeholder="性别">
      <input v-model="Student.course" class="myinput" type="text" placeholder="课程">

      <button v-if="!editAdminObj" class="btn" @click="addStu()">
        <i class="fa fa-plus" aria-hidden="true"></i>添加
      </button>
      <button v-if="editAdminObj" class="btn" @click="updStu()">
        <i class="fa fa-save" aria-hidden="true"></i>保存
      </button>
      <button style="opacity: 0.8;" v-if="editAdminObj" class="btn" @click="unupdStu()">
        <i class="fa fa fa-times-circle-o" aria-hidden="true"></i>取消
      </button>
    </div>
    <grid
      :listData="listData"
      :theadData="theadData"
      :ifEdit="true"
      :ifDelete="true"
      :ifpage="true"
      :pageInfo="pageInfo"
      @on-delete="deleteStu"
      @on-edit="editStu"
      @on-gopage="gopage"
    ></grid>
  </div>
</template>

<script>
var theadData = [
  {
    title: "学员姓名",
    keyname: "name"
  },
  {
    title: "年龄",
    keyname: "age"
  },
  {
    title: "性别",
    keyname: "gender"
  },
  {
    title: "课程",
    keyname: "course"
  }
];
import grid from "./grid.vue";
export default {
  name: "studentList",
  data() {
    return {
      listData: [],
      theadData: theadData,
      Student: {
        name: "",
        age: "",
        gender: "",
        course: ""
      },
      editAdminObj: null, //用于存放正在编辑的用户
      pageInfo: {}
    };
  },
  mounted: function() {
    this.getStuList(1);
  },
  methods: {
    getStuList(page) {
      var _this = this;
      this.$reqs
        .post("/student/StudentList", {
          page: page
        })
        .then(function(result) {
          //success
          _this.listData = result.data.data;
          _this.pageInfo.allpage = Math.ceil(result.data.total / 5);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    addStu() {
      if (
        !this.Student.name ||
        !this.Student.age ||
        !this.Student.gender ||
        !this.Student.course
      ) {
        alert("不能为空");
        return false;
      }
      this.$reqs
        .post("/student/add", this.Student)
        .then(result => {
          this.getStuList();
          this.emptyStudent();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //将信息读取至输入框
    editStu(item) {
      this.editAdminObj = item;
      this.Student = JSON.parse(JSON.stringify(item));
    },
    updStu() {
      if (
        !this.Student.name ||
        !this.Student.age ||
        !this.Student.gender ||
        !this.Student.course
      ) {
        alert("不能为空");
        return false;
      }
      this.$reqs
        .post("/student/update", this.Student)
        .then(result => {
          this.gopage(this.pageInfo.current);

          this.editAdminObj = null;
          this.emptyStudent();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    unupdStu() {
      this.editAdminObj = null;
      this.emptyStudent();
    },
    deleteStu(item) {
      this.$reqs
        .post("/student/delete", item)
        .then(result => {
          this.gopage(this.pageInfo.current);
          this.emptyStudent();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    emptyStudent() {
      this.Student.name = "";
      this.Student.age = "";
      this.Student.gender = "";
      this.Student.course = "";
    },
    gopage(index) {
      this.pageInfo.current = index;
      //查询数据
      this.getStuList(index);
    }
  },
  components: { grid }
};
</script>

<style scoped>
.main {
  border-radius: 4px;
  background: #fff;
  margin-top: 10px;
}

.input_box {
  padding: 0 10px;
}
.input_box .myinput {
  width: 25%;
}
</style>

