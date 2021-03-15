let stage_list = ["TOP_OF_PIPE_BIT", "DRAW_INDIRECT_BIT", "VERTEX_INPUT_BIT", "VERTEX_SHADER_BIT", "TESSELLATION_CONTROL_SHADER_BIT", "TESSELLATION_EVALUATION_SHADER_BIT", "GEOMETRY_SHADER_BIT", "FRAGMENT_SHADER_BIT", "EARLY_FRAGMENT_TESTS_BIT", "LATE_FRAGMENT_TESTS_BIT", "COLOR_ATTACHMENT_OUTPUT_BIT", "COMPUTE_SHADER_BIT", "TRANSFER_BIT", "BOTTOM_OF_PIPE_BIT", "HOST_BIT", "ALL_GRAPHICS_BIT", "ALL_COMMANDS_BIT"];

let access_list = ["INDIRECT_COMMAND_READ_BIT", "INDEX_READ_BIT", "VERTEX_ATTRIBUTE_READ_BIT", "UNIFORM_READ_BIT", "INPUT_ATTACHMENT_READ_BIT", "SHADER_READ_BIT", "SHADER_WRITE_BIT", "COLOR_ATTACHMENT_READ_BIT", "COLOR_ATTACHMENT_WRITE_BIT", "DEPTH_STENCIL_ATTACHMENT_READ_BIT", "DEPTH_STENCIL_ATTACHMENT_WRITE_BIT", "TRANSFER_READ_BIT", "TRANSFER_WRITE_BIT", "HOST_READ_BIT", "HOST_WRITE_BIT", "MEMORY_READ_BIT", "MEMORY_WRITE_BIT"];

let pipelines_stages = {};
pipelines_stages["graphics_primitive"] = ["DRAW_INDIRECT_BIT", "VERTEX_INPUT_BIT ", "VERTEX_SHADER_BIT", "TESSELLATION_CONTROL_SHADER_BIT", "TESSELLATION_EVALUATION_SHADER_BIT", "GEOMETRY_SHADER_BIT", "TRANSFORM_FEEDBACK_BIT_EXT", "FRAGMENT_SHADING_RATE_ATTACHMENT_BIT_KHR", "EARLY_FRAGMENT_TESTS_BIT", "FRAGMENT_SHADER_BIT", "LATE_FRAGMENT_TESTS_BIT", "COLOR_ATTACHMENT_OUTPUT_BIT"]
pipelines_stages["graphics_mesh"] = ["DRAW_INDIRECT_BIT", "TASK_SHADER_BIT_NV", "MESH_SHADER_BIT_NV", "FRAGMENT_SHADING_RATE_ATTACHMENT_BIT_KHR", "EARLY_FRAGMENT_TESTS_BIT", "FRAGMENT_SHADER_BIT", "LATE_FRAGMENT_TESTS_BIT", "COLOR_ATTACHMENT_OUTPUT_BIT"]
pipelines_stages["raytracing"] = ["DRAW_INDIRECT_BIT", "RAY_TRACING_SHADER_BIT_KHR"]


function create(type, content, class_list = []){
   var el = document.createElement(type);
   el.innerHTML = content;
   el.classList.add(...class_list);
   return el;
}

function get_select_text(select_id){
   let element = document.querySelector(select_id);
   let text = element.options[element.selectedIndex].text;
   return text;
}

function get_int(str){
   return parseInt(str, 10);
}

function delete_class(element, class_name){
   if (element.classList.contains(class_name)) {
      element.classList.remove(class_name);
   }
}

function add_class(element, class_name){
   if (!element.classList.contains(class_name)) {
      element.classList.add(class_name);
   }
}

function section_button_clicked(tab_button_element){
   for(let item of document.querySelector("#tab_bar").children){
      delete_class(item, "active_button");
   };
   tab_button_element.className += " active_button";
   
   // Make all sections invisible
   for(let section of document.querySelectorAll("section"))
      add_class(section, "invisible");
   
   // But restore visibility for one
   let tab_id = tab_button_element.getAttribute("data-tabid");
   document.querySelector(tab_id).className = "";
}

function build_labeled_checkbox(name, initial_checked){
   let input = document.createElement("input");
   input.type = "checkbox";
   input.id = name; // to make this toggable by a label click
   input.addEventListener("change", scope_checkbox_clicked);
   input.checked = initial_checked;
   let label = create("label", name);
   label.htmlFor = name;
   return [input, label];
}

function get_ij_stage_and_access(i, j){
   return [stage_list[i], access_list[j]];
}

function build_table(id_str, default_stages, default_accesses){
   let table = create("div", "", ["table"]);
   table.id = id_str;
   
   // Access flags
   {
      let first_row = create("div", "", ["table_row"])
      first_row.appendChild(create("div", ""));
      access_list.forEach(access => {
         let access_el = create("div", "", ["rot"]);
         let checked = default_accesses.includes(access);
         let labeled_box = build_labeled_checkbox(access, checked);
         access_el.appendChild(labeled_box[0]);
         access_el.appendChild(labeled_box[1]);
         
         first_row.appendChild(access_el);
      });
      
      table.appendChild(first_row);
   }
   
   
   // Stage flags
   {
      stage_list.forEach(stage => {
         let row = create("div", "", ["table_row"])
         {
            let stage_el = create("div", "");
            let checked = default_stages.includes(stage);
            let labeled_box = build_labeled_checkbox(stage, checked);
            stage_el.appendChild(labeled_box[0]);
            stage_el.appendChild(labeled_box[1]);
            row.appendChild(stage_el);
         }
         access_list.forEach(access => {
            row.appendChild(create("div", " ", ["table_cell"]));
         });
         
         table.appendChild(row);
      });
   }
   
   // Make the legal ones green
   for (let i_stage = 0; i_stage < stage_list.length; i_stage++) {
      for (let j_access = 0; j_access < access_list.length; j_access++) {
         let stage_and_access = get_ij_stage_and_access(i_stage, j_access);
         let is_t4 = table4(stage_and_access[1], stage_and_access[0]);
         if(is_t4){
            table.children[i_stage+1].children[j_access+1].classList.add("green");
         }
      }
   }

   return table;
}

function get_table_stage_scope(table){
   stage_flags = [];
   for (let i = 0; i < stage_list.length; i++) {
      const row_el = table.children[i+1];
      let row_head_el = row_el.children[0];
      let input_el = row_head_el.querySelector("input");
      if(input_el.checked){
         stage_flags.push(input_el.id);
      }
   }
   return stage_flags;
}


function get_table_access_scope(table){
   access_flags = [];
   let header_row_el = table.children[0];
   for (let i = 0; i < access_list.length; i++) {
      let column_head_el = header_row_el.children[i+1];
      let input_el = column_head_el.querySelector("input");
      if(input_el.checked){
         access_flags.push(input_el.id);
      }
   }
   return access_flags;
}


function get_stages_and_accesses(id){
   const source_table = document.querySelector(id);
   return [get_table_stage_scope(source_table), get_table_access_scope(source_table)];
}


function write_pretty_bitmask(scope_str_array, prefix, target_div){
   target_div.innerHTML = "";
   if(scope_str_array.length == 0){
      target_div.appendChild(create("div", "0,"));
   }
   else{
      for (let i = 0; i < scope_str_array.length; i++) {
         let is_last = i == (scope_str_array.length - 1);
         let scope_str = prefix + scope_str_array[i];
         if(!is_last)
            scope_str += " |";
         else
            scope_str += ","
         target_div.appendChild(create("div", scope_str));
      }
   }
}

function scope_checkbox_clicked(){
   let [src_stage_scope, src_access_scope] = get_stages_and_accesses("#src_scope");
   let [dst_stage_scope, dst_access_scope] = get_stages_and_accesses("#dst_scope");
   
   write_pretty_bitmask(src_stage_scope, "VK_PIPELINE_STAGE_", document.querySelector("#srcStageMask"));
   write_pretty_bitmask(src_access_scope, "VK_ACCESS_", document.querySelector("#srcAccessMask"));
   
   write_pretty_bitmask(dst_stage_scope, "VK_PIPELINE_STAGE_", document.querySelector("#dstStageMask"));
   write_pretty_bitmask(dst_access_scope, "VK_ACCESS_", document.querySelector("#dstAccessMask"));
   
   check_and_display_info();
}


// Table 4 from spec 1.2.172. This expects strings without the VK_ACCESS_ and VK_PIPELINE_STAGE_ prefixes
function table4(access, stage){
   if(access=="0"){
      return true;
   }
   
   if(stage=="ALL_COMMANDS_BIT"){
      return true;
   }
   
   // "VK_PIPELINE_STAGE_ALL_GRAPHICS_BIT specifies the execution of all graphics pipeline stages, and is equivalent to the logical OR of:""
   if(stage=="ALL_GRAPHICS_BIT"){
      let equivalent = ["DRAW_INDIRECT_BIT", "TASK_SHADER_BIT_NV", "MESH_SHADER_BIT_NV", "VERTEX_INPUT_BIT", "VERTEX_SHADER_BIT", "TESSELLATION_CONTROL_SHADER_BIT", "TESSELLATION_EVALUATION_SHADER_BIT", "GEOMETRY_SHADER_BIT", "FRAGMENT_SHADER_BIT", "EARLY_FRAGMENT_TESTS_BIT", "LATE_FRAGMENT_TESTS_BIT", "COLOR_ATTACHMENT_OUTPUT_BIT", "CONDITIONAL_RENDERING_BIT_EXT", "TRANSFORM_FEEDBACK_BIT_EXT", "FRAGMENT_SHADING_RATE_ATTACHMENT_BIT_KHR", "FRAGMENT_DENSITY_PROCESS_BIT_EXT"];
      
      return equivalent.some((equiv_stage) => table4(access, equiv_stage));
   }
   
   if(access=="INDIRECT_COMMAND_READ_BIT"){
      return ["DRAW_INDIRECT_BIT", "ACCELERATION_STRUCTURE_BUILD_BIT_KHR"].includes(stage);
   }
   else if(["INDEX_READ_BIT", "VERTEX_ATTRIBUTE_READ_BIT"].includes(access)){
      return ["VERTEX_INPUT_BIT"].includes(stage);
   }
   else if(["UNIFORM_READ_BIT", "SHADER_WRITE_BIT"].includes(access)){
      return ["TASK_SHADER_BIT_NV", "MESH_SHADER_BIT_NV", "RAY_TRACING_SHADER_BIT_KHR", "VERTEX_SHADER_BIT", "TESSELLATION_CONTROL_SHADER_BIT", "TESSELLATION_EVALUATION_SHADER_BIT", "GEOMETRY_SHADER_BIT", "FRAGMENT_SHADER_BIT", "COMPUTE_SHADER_BIT"].includes(stage);
   }
   else if(access=="SHADER_READ_BIT"){
      return ["ACCELERATION_STRUCTURE_BUILD_BIT_KHR", "TASK_SHADER_BIT_NV", "MESH_SHADER_BIT_NV", "RAY_TRACING_SHADER_BIT_KHR", "VERTEX_SHADER_BIT", "TESSELLATION_CONTROL_SHADER_BIT", "TESSELLATION_EVALUATION_SHADER_BIT", "GEOMETRY_SHADER_BIT", "FRAGMENT_SHADER_BIT", "COMPUTE_SHADER_BIT"].includes(stage);
   }
   else if(access=="INPUT_ATTACHMENT_READ_BIT"){
      return ["FRAGMENT_SHADER_BIT"].includes(stage);
   }
   else if(["COLOR_ATTACHMENT_READ_BIT", "COLOR_ATTACHMENT_WRITE_BIT"].includes(access)){
      return ["COLOR_ATTACHMENT_OUTPUT_BIT"].includes(stage);
   }
   else if(["DEPTH_STENCIL_ATTACHMENT_READ_BIT", "DEPTH_STENCIL_ATTACHMENT_WRITE_BIT"].includes(access)){
      return ["EARLY_FRAGMENT_TESTS_BIT", "LATE_FRAGMENT_TESTS_BIT"].includes(stage);
   }
   else if(["TRANSFER_READ_BIT", "TRANSFER_WRITE_BIT"].includes(access)){
      return ["TRANSFER_BIT", "ACCELERATION_STRUCTURE_BUILD_BIT_KHR"].includes(stage);
   }
   else if(["HOST_READ_BIT", "HOST_WRITE_BIT"].includes(access)){
      return ["HOST_BIT"].includes(stage);
   }
   else if(["MEMORY_READ_BIT", "MEMORY_WRITE_BIT"].includes(access)){
      return true;
   }
   else if(access=="COLOR_ATTACHMENT_READ_NONCOHERENT_BIT_EXT"){
      return ["COLOR_ATTACHMENT_OUTPUT_BIT"].includes(stage);
   }
   else if(["COMMAND_PREPROCESS_READ_BIT_NV", "COMMAND_PREPROCESS_WRITE_BIT_NV"].includes(access)){
      return ["COMMAND_PREPROCESS_BIT_NV"].includes(stage);
   }
   else if(access=="CONDITIONAL_RENDERING_READ_BIT_EXT"){
      return ["CONDITIONAL_RENDERING_BIT_EXT"].includes(stage);
   }
   else if(access=="FRAGMENT_SHADING_RATE_ATTACHMENT_READ_BIT_KHR"){
      return ["FRAGMENT_SHADING_RATE_ATTACHMENT_BIT_KHR"].includes(stage);
   }
   else if(["TRANSFORM_FEEDBACK_WRITE_BIT_EXT", "TRANSFORM_FEEDBACK_COUNTER_WRITE_BIT_EXT"].includes(access)){
      return ["TRANSFORM_FEEDBACK_BIT_EXT"].includes(stage);
   }
   else if(access=="TRANSFORM_FEEDBACK_COUNTER_READ_BIT_EXT"){
      return ["TRANSFORM_FEEDBACK_BIT_EXT", "DRAW_INDIRECT_BIT"].includes(stage);
   }
   else if(access=="ACCELERATION_STRUCTURE_READ_BIT_KHR"){
      return ["TASK_SHADER_BIT_NV", "MESH_SHADER_BIT_NV", "VERTEX_SHADER_BIT", "TESSELLATION_CONTROL_SHADER_BIT", "TESSELLATION_EVALUATION_SHADER_BIT", "GEOMETRY_SHADER_BIT", "FRAGMENT_SHADER_BIT", "COMPUTE_SHADER_BIT", "RAY_TRACING_SHADER_BIT_KHR", "ACCELERATION_STRUCTURE_BUILD_BIT_KHR"].includes(stage);
   }
   else if(access=="ACCELERATION_STRUCTURE_WRITE_BIT_KHR"){
      return ["ACCELERATION_STRUCTURE_BUILD_BIT_KHR"].includes(stage);
   }
   else if(access=="FRAGMENT_DENSITY_MAP_READ_BIT_EXT"){
      return ["FRAGMENT_DENSITY_PROCESS_BIT_EXT"].includes(stage);
   }
   console.log("This access scope is apparently not covered. That should not happen - Tell me!. access: " + access + ", stage: " + stage);
}


function is_scope_valid(table_id){
   const [pipeline_stages, access_flags] = get_stages_and_accesses(table_id);

   const is_access_supported = (access_flag) => pipeline_stages.some( (stage) => table4(access_flag, stage));
   return access_flags.every((access_flag) => is_access_supported(access_flag));
}

function is_stage_mask_pipe_end(stage_mask){
   return ["TOP_OF_PIPE_BIT", "BOTTOM_OF_PIPE_BIT"].includes(stage_mask);
}


function stage_masks_are_only_pipe_ends(stage_masks){
   if(stage_masks.length == 0){
      return false;
   }
   return stage_masks.every( (stage_mask) => is_stage_mask_pipe_end(stage_mask));
}


function does_table_do_memory_acc(table_id){
   let table_el = document.querySelector(table_id);
   let access_masks = get_table_access_scope(table_el);
   let does_memory_access = access_masks.length > 0;
   return does_memory_access;
}


function does_table_do_memory_acc_w_pipe_ends(table_id){
   let table_el = document.querySelector(table_id);
   let stage_masks = get_table_stage_scope(table_el);
   return stage_masks_are_only_pipe_ends(stage_masks) && does_table_do_memory_acc(table_id);
}


function get_error_txt(){
   let external_src_subpass = get_select_text('#srcSubpass') == "VK_SUBPASS_EXTERNAL";
   let external_dst_subpass = get_select_text('#dstSubpass') == "VK_SUBPASS_EXTERNAL";
   if(external_src_subpass && external_dst_subpass){
      return ["<code>srcSubpass</code> and <code>dstSubpass</code> must not both be equal to <code>VK_SUBPASS_EXTERNAL</code>."];
   }
   
   // srcSubpass must be less than or equal to dstSubpass
   if(!external_src_subpass && !external_dst_subpass){
      if(get_int(get_select_text('#srcSubpass')) > get_int(get_select_text('#dstSubpass'))){
         return ["<code>srcSubpass</code> must be less than or equal to <code>dstSubpass</code>, unless one of them is <code>VK_SUBPASS_EXTERNAL</code>, to avoid cyclic dependencies and ensure a valid execution order"];
      }
   }
   
   // Is table 4 fulfilled?
   {
      const make_table4_error = function(stageMask){
         return [`Any access flag included in <code>srcAccessMask</code> must be supported by one of the pipeline stages in <code>${stageMask}</code>, as specified in <a href=\"https://www.khronos.org/registry/vulkan/specs/1.2-extensions/html/vkspec.html#synchronization-access-types-supported\">table of supported access types</a>`];
      }
      if(!is_scope_valid("#src_scope")){
         return make_table4_error("srcStageMask");
      }
      if(!is_scope_valid("#dst_scope")){
         return make_table4_error("dstStageMask");
      }
   }
   
   // Memory access with pipe end
   {
      const make_error = function(problem_scope){
         return [`Defining a memory access != 0 with a TOP/BOTTOM_OF_PIPE stage mask in the ${problem_scope} scope. That is legal, but probably a mistake since those stages don't perform memory access.`];
      }
      if(does_table_do_memory_acc_w_pipe_ends("#src_scope")){
         return make_error("source");
      }
      if(does_table_do_memory_acc_w_pipe_ends("#dst_scope")){
         return make_error("destination");
      }
   }
   
   return [];
}

function is_dep_on_read(){
   let source_table = document.querySelector("#src_scope");
   let source_access_scope = get_table_access_scope(source_table);
   return source_access_scope.some( (access_mask) => access_mask.includes("_READ_BIT") );
}


function get_is_exec_dependency(){
   return !does_table_do_memory_acc("#src_scope") && !does_table_do_memory_acc("#dst_scope");
}


function check_and_display_info(){
   var result_el = document.querySelector('#result');
   result_el.innerHTML = '';
   
   var error_txt = get_error_txt();
   if(error_txt.length > 0){
      result_el.appendChild(create("p", error_txt[0], ["error"]));
      return;
   }
   
   // "Creates dependency between A and B"
   result_el.appendChild(create("span", "Creates a dependency between"));
   let ul = document.createElement('ul')
   if (get_select_text('#srcSubpass') === "VK_SUBPASS_EXTERNAL"){
      ul.appendChild(create("li", "Commands that occur earlier in submission order than the <code>vkCmdBeginRenderPass</code> used to begin the render pass instance and"));
   }
   else{
      ul.appendChild(create("li", "Subpass " + get_select_text("#srcSubpass") +" and"));
   }
   
   if (get_select_text('#dstSubpass') === "VK_SUBPASS_EXTERNAL"){
      ul.appendChild(create("li", "Commands that occur later in submission order than the  <code>vkCmdEndRenderPass</code> used to end the render pass instance."));
   }
   else{
      ul.appendChild(create("li", "Subpass " + get_select_text("#dstSubpass")));
   }
   result_el.appendChild(ul);
   
   // srcSubpass == dstSubpass
   if(get_select_text('#srcSubpass') == get_select_text('#dstSubpass')){
      result_el.appendChild(create("p", "This is a subpass self-dependency. About this, @marttyfication has a few words:"));
      result_el.appendChild(create("blockquote", "you probably don't want a subpass self dep, fix your validation error by not barriering inside renderpasses 😛. it was a half joke. you need it sometimes (framebuffer feedback) but it is niche. the problem is when people barrier inside the render pass, the validation layer tells them that can only be done with a self-dep."));
   }
   
   // Memory or execution dependency?
   let is_exec_dependency = get_is_exec_dependency()
   if(is_exec_dependency){
      result_el.appendChild(create("p", "Both access masks are zero. That means no visibility or availability operations are generated. That means this is only an execution dependency."));
   }
   
   // let no_first_scope = get_select_text('#srcStageMask') == "VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT";
   // let full_first_scope = get_select_text('#srcStageMask') == "VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT";
   // let full_second_scope = get_select_text('#dstStageMask') == "VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT";
   // let no_second_scope = get_select_text('#dstStageMask') == "VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT";
   // if(no_first_scope){
   //    result_el.appendChild(create("p", "<code>srcStageMask=VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT</code> includes no pipeline stages in first synchronization scope => this waits for nothing (not necessarily bad, just FYI)"));
   // }
   // if(full_first_scope){
   //    result_el.appendChild(create("p", "<code>srcStageMask=VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT</code> includes all pipeline stages as first synchronization scope"));
   // }
   // if(no_second_scope){
   //    result_el.appendChild(create("p", "<code>dstStageMask=VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT</code> includes no pipeline stages in second synchronization scope"));
   // }
   // if(full_second_scope){
   //    result_el.appendChild(create("p", "<code>dstStageMask=VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT</code> includes all pipeline stages as second synchronization scope"));
   // }
   // if(no_first_scope && no_second_scope){
   //    result_el.appendChild(create("p", "This doesn't do anything. If you just want to explicitly override the implicit dependency, good for you! If you expect this to do something, you're probably wrong (or I am)"));
   // }
   
   if(!is_exec_dependency){
      //    let source_scope = "<code>" + get_select_text('#srcStageMask') + " × " + get_select_text('#srcAccessMask') + "</code>";
      //    if(get_select_text('#srcAccessMask') == "0")
      //    source_scope = "Actually nothing because <code>srcAccessMask=0</code>";
      
      //    let destination_scope = "<code>" + get_select_text('#dstStageMask') + " × " + get_select_text('#dstAccessMask') + "</code>";
      //    if(get_select_text('#dstAccessMask') == "0")
      //    destination_scope = "Actually nothing because <code>dstAccessMask=0</code>";
      
      //    result_el.appendChild(create("p", "This creates a memory dependency that will make everything in the source scope available, and everything available (including layout transitions because \"writes performed by a layout transition are automatically made available\") visible in the destination scope."));
      
      //    ul = document.createElement('ul')
      //    ul.appendChild(create("li", "Source Scope: " + source_scope));
      //    ul.appendChild(create("li", "Destination Scope: " + destination_scope));
      //    result_el.appendChild(ul);
      
      
      if(is_dep_on_read()){
         result_el.appendChild(create("p", "One of the <code>srcAccessMask</code> flags is a _READ_BIT. That isn't harmful, but a mistake. Reads don't need to be made visible as they don't write memory."));
      }
   }
}


function pipeline_change(){
   let element = document.querySelector("#pipeline-select");
   let pipeline_name = element.options[element.selectedIndex].value;

   let pipeline_container = document.querySelector("#pipeline_stages");
   pipeline_container.innerHTML = "";

   for (let i = 0; i < pipelines_stages[pipeline_name].length; i++) {
      if(i != 0){
         pipeline_container.appendChild(create("div", "↓", ["noselect"]));
      }
      const stage = pipelines_stages[pipeline_name][i];
      pipeline_container.appendChild(create("div", stage));
   }
}


let dependency_presets = {};
function add_preset(name, src_stage, src_access, dst_stage, dst_access){
   dependency_presets[name] = {
      "src_stage": src_stage,
      "src_access": src_access,
      "dst_stage": dst_stage,
      "dst_access": dst_access
   };
}


function apply_preset(preset){
   document.querySelector("#tab_src").appendChild(build_table("src_scope", preset["src_stage"], preset["src_access"]));
   document.querySelector("#tab_dst").appendChild(build_table("dst_scope", preset["dst_stage"], preset["dst_access"]));
}

document.addEventListener("DOMContentLoaded", function(event) {
   document.querySelector('#srcSubpass').addEventListener("change", check_and_display_info);
   document.querySelector('#dstSubpass').addEventListener("change", check_and_display_info);
   document.querySelector('#pipeline-select').addEventListener("change", pipeline_change);

   add_preset(
      "first_implicit",
      ["TOP_OF_PIPE_BIT"],
      [],
      ["ALL_COMMANDS_BIT"],
      ["INPUT_ATTACHMENT_READ_BIT", "COLOR_ATTACHMENT_READ_BIT", "COLOR_ATTACHMENT_WRITE_BIT", "DEPTH_STENCIL_ATTACHMENT_READ_BIT", "DEPTH_STENCIL_ATTACHMENT_WRITE_BIT"]
   );
   console.log(dependency_presets);
   
   apply_preset(dependency_presets["first_implicit"]);

   scope_checkbox_clicked();
   pipeline_change();
});
