<template>
  <div class="adminList main">
    <div class="input_box">
      <input v-model="Course.courseName" class="myinput" type="text" placeholder="课程名称">
      <button v-if="!editAdminObj" class="btn" @click="addCourse()">
        <i class="fa fa-plus" aria-hidden="true"></i>添加
      </button>
      <button v-if="editAdminObj" class="btn" @click="saveEditAdmin()">
        <i class="fa fa-save" aria-hidden="true"></i>保存
      </button>
      <button style="opacity: 0.8;" v-if="editAdminObj" class="btn" @click="cancelEditAdmin()">
        <i class="fa fa fa-times-circle-o" aria-hidden="true"></i>取消
      </button>
    </div>
    <grid :listData="listData" :theadData="theadData" :ifEdit="true" :ifDelete="true" :ifpage="true" :pageInfo="pageInfo" @on-delete="deleteAdmin" @on-edit="editCourse" @on-gopage="gopage"></grid>
  </div>
</template>

<script>
var theadData = [
  {
    title: "课程名",
    keyname: "courseName"
  }
];
import grid from "./grid.vue";
export default {
  name: "adminList",
  data() {
    return {
      listData: [],
      theadData: theadData,
      Course: {
        courseName: ""
      },
      editAdminObj: null, //用于存放正在编辑的用户
      pageInfo: {}
    };
  },
  mounted: function() {
    this.getCourseList(1);
  },
  methods: {
    getCourseList(page) {
      var _this = this;

      this.$reqs
        .post("/course/CourseList", {
          page: page
        })
        .then(function(result) {
          //成功
          _this.listData = result.data.data;
          _this.pageInfo.allpage = Math.ceil(result.data.total / 5);
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    addCourse() {
      //添加用户
      if (!this.Course.courseName ) {
        alert("不能为空");
        return false;
      }
      this.$reqs
        .post("/course/add", this.Course)
        .then(result => {
          //成功
          this.getCourseList();
          this.emptyAdmin();
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    editCourse(item) {
      //编辑用户
      this.editAdminObj = item;
      this.Course = JSON.parse(JSON.stringify(item));
    },
    saveEditAdmin() {
      if (!this.Course.courseName) {
        alert("不能为空");
        return false;
      }
      this.$reqs
        .post("/course/update", this.Course)
        .then(result => {
          //成功
          this.gopage(this.pageInfo.current);

          this.editAdminObj = null;
          this.emptyAdmin();
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    cancelEditAdmin() {
      this.editAdminObj = null;
      this.emptyAdmin();
    },
    emptyAdmin() {
      //清空输入框（多次使用，所以封装到这里）
      this.Course.courseName = "";
    },
    deleteAdmin(item) {
      this.$reqs
        .post("/course/delete", item)
        .then(result => {
          //成功
          this.gopage(this.pageInfo.current);
          this.emptyAdmin();
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    gopage(index) {
      this.pageInfo.current = index;
      //查询数据
      this.getCourseList(index);
    }
  },
  components: { grid }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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