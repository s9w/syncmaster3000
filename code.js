let stage_list = ["TOP_OF_PIPE_BIT", "DRAW_INDIRECT_BIT", "VERTEX_INPUT_BIT", "VERTEX_SHADER_BIT", "TESSELLATION_CONTROL_SHADER_BIT", "TESSELLATION_EVALUATION_SHADER_BIT", "GEOMETRY_SHADER_BIT", "FRAGMENT_SHADER_BIT", "EARLY_FRAGMENT_TESTS_BIT", "LATE_FRAGMENT_TESTS_BIT", "COLOR_ATTACHMENT_OUTPUT_BIT", "COMPUTE_SHADER_BIT", "TRANSFER_BIT", "BOTTOM_OF_PIPE_BIT", "HOST_BIT", "ALL_GRAPHICS_BIT", "ALL_COMMANDS_BIT"];
   
let access_list = ["INDIRECT_COMMAND_READ_BIT", "INDEX_READ_BIT", "VERTEX_ATTRIBUTE_READ_BIT", "UNIFORM_READ_BIT", "INPUT_ATTACHMENT_READ_BIT", "SHADER_READ_BIT", "SHADER_WRITE_BIT", "COLOR_ATTACHMENT_READ_BIT", "COLOR_ATTACHMENT_WRITE_BIT", "DEPTH_STENCIL_ATTACHMENT_READ_BIT", "DEPTH_STENCIL_ATTACHMENT_WRITE_BIT", "TRANSFER_READ_BIT", "TRANSFER_WRITE_BIT", "HOST_READ_BIT", "HOST_WRITE_BIT", "MEMORY_READ_BIT", "MEMORY_WRITE_BIT"];


function create(type, content, cl){
   var el = document.createElement(type);
   el.innerHTML = content;
   if(typeof cl !== 'undefined')
   el.classList.add(cl);
   return el;
}

function get_select_text(id){
   let el = document.querySelector(id);
   let text = el.options[el.selectedIndex].text;
   return text;
}

function get_int(str){
   return parseInt(str, 10);
}

function section_button_clicked(button_el){
   // Make all buttons non-active
   document.querySelector("#tab_bar").childNodes.forEach(button_el => {
      button_el.className = "button";
   });

   // But make the pressed button active
   button_el.className += " active_button";
   
   // Make all sections invisible
   document.querySelector("#tab_main").className = "invisible";
   document.querySelector("#tab_src").className = "invisible";
   document.querySelector("#tab_dst").className = "invisible";
   
   // But restore visibility for one
   let tab_id = button_el.getAttribute("data-tabid");
   let section_div = document.querySelector(tab_id);
   section_div.className = "";
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
   if(i > stage_list.length)
      console.log("i too big");
   if(i > access_list.length)
      console.log("j too big");
   return [stage_list[i], access_list[j]];
}

function build_table(id_str, default_stages, default_accesses){
   let tbody = document.createElement("tbody");
   
   // Access bits
   {
      let tr = document.createElement("tr");
      tr.appendChild(create("th", ""));
      access_list.forEach(access => {
         let th = create("th", "", "col_header");
         let checked = default_accesses.includes(access);
         let labeled_box = build_labeled_checkbox(access, checked);
         th.appendChild(labeled_box[0]);
         th.appendChild(labeled_box[1]);
         tr.appendChild(th);
      });
      // let thead = create("thread", "");
      // thead.appendChild(tr);
      // tbody.appendChild(thead);

      tbody.appendChild(tr);
   }

   // Stage bits
   {
      stage_list.forEach(stage => {
         let tr = document.createElement("tr");
         {
            let th = create("th", "", "row_header");
            let checked = default_stages.includes(stage);
            let labeled_box = build_labeled_checkbox(stage, checked);
            th.appendChild(labeled_box[0]);
            th.appendChild(labeled_box[1]);
            tr.appendChild(th);
         }
         access_list.forEach(access => {
            tr.appendChild(create("td", " "));
         });
         
         tbody.appendChild(tr);
      });
   }

   // Make the legal ones green
   for (let i_stage = 0; i_stage < stage_list.length; i_stage++) {
      for (let j_access = 0; j_access < access_list.length; j_access++) {
         let stage_and_access = get_ij_stage_and_access(i_stage, j_access);
         let is_t4 = table4(stage_and_access[1], stage_and_access[0]);
         if(is_t4){
            tbody.children[i_stage+1].children[j_access+1].classList.add("green");
         }
      }
   }
   
   
   let table = document.createElement("table");
   table.id = id_str;
   table.appendChild(tbody);
   return table;
}

function get_table_stage_scope(table){
   stage_scope = [];
   let tbody = table.children[0];
   for (let i = 0; i < stage_list.length; i++) {
      let input_el = tbody.children[i+1].children[0].children[0];
      if(input_el.checked){
         stage_scope.push(input_el.id);
      }
   }
   return stage_scope;
}

function get_table_access_scope(table){
   access_scope = [];
   let tr = table.children[0].children[0];
   for (let i = 0; i < stage_list.length; i++) {
      let input_el = tr.children[i+1].children[0];
      if(input_el.checked){
         access_scope.push(input_el.id);
      }
   }
   return access_scope;
}


function get_printable_bitmask(scope_str_array, target_div, prefix){
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
   let source_table = document.querySelector("#src_scope");
   let source_stage_scope = get_table_stage_scope(source_table);
   let source_access_scope = get_table_access_scope(source_table);

   let dst_table = document.querySelector("#dst_scope");
   let dst_stage_scope = get_table_stage_scope(dst_table);
   let dst_access_scope = get_table_access_scope(dst_table);

   get_printable_bitmask(source_stage_scope, document.querySelector("#srcStageMask"), "VK_PIPELINE_STAGE_");
   get_printable_bitmask(source_access_scope, document.querySelector("#srcAccessMask"), "VK_ACCESS_");

   get_printable_bitmask(dst_stage_scope, document.querySelector("#dstStageMask"), "VK_PIPELINE_STAGE_");
   get_printable_bitmask(dst_access_scope, document.querySelector("#dstAccessMask"), "VK_ACCESS_");

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


function is_table_valid(table_id){
   let table_el = document.querySelector(table_id);
   let stage_masks = get_table_stage_scope(table_el);
   let access_masks = get_table_access_scope(table_el);
   for (let i = 0; i < access_masks.length; i++) {
      let are_all_supported = stage_masks.some( (srcStageMask) => table4(access_masks[i], srcStageMask) );
      if(!are_all_supported){
         return false;
      }
   }
   return true;
}


function stage_masks_are_only_pipe_ends(stage_masks){
   if(stage_masks.length == 0)
      return false;
   return stage_masks.every( (stageMask) => (stageMask == "TOP_OF_PIPE_BIT") || (stageMask == "BOTTOM_OF_PIPE_BIT"));
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
   
   if(get_select_text('#srcSubpass') == "VK_SUBPASS_EXTERNAL" && get_select_text('#dstSubpass') == "VK_SUBPASS_EXTERNAL"){
      return ["<code>srcSubpass</code> and <code>dstSubpass</code> must not both be equal to <code>VK_SUBPASS_EXTERNAL</code>."];
   }
   
   // srcSubpass must be less than or equal to dstSubpass
   if(get_select_text('#srcSubpass') !== "VK_SUBPASS_EXTERNAL" && get_select_text('#srcSubpass') !== "VK_SUBPASS_EXTERNAL")
   {
      if(get_int(get_select_text('#srcSubpass')) > get_int(get_select_text('#dstSubpass'))){
         return ["<code>srcSubpass</code> must be less than or equal to <code>dstSubpass</code>, unless one of them is <code>VK_SUBPASS_EXTERNAL</code>, to avoid cyclic dependencies and ensure a valid execution order"];
      }
   }
   
   // Is table 4 fulfilled? Spec:
   // "Any access flag included in src/dstAccessMask must be supported by one of the pipeline stages in src/dstStageMask, as specified in the table of supported access types"
   if(!is_table_valid("#src_scope")){
      return ["Any access flag included in <code>srcAccessMask</code> must be supported by one of the pipeline stages in <code>srcStageMask</code>, as specified in <a href=\"https://www.khronos.org/registry/vulkan/specs/1.2-extensions/html/vkspec.html#synchronization-access-types-supported\">table of supported access types</a>"];
   }
   if(!is_table_valid("#dst_scope")){
      return ["Any access flag included in <code>dstAccessMask</code> must be supported by one of the pipeline stages in <code>srcStageMask</code>, as specified in <a href=\"https://www.khronos.org/registry/vulkan/specs/1.2-extensions/html/vkspec.html#synchronization-access-types-supported\">table of supported access types</a>"];
   }
   
   // Memory access with pipe end
   if(does_table_do_memory_acc_w_pipe_ends("#src_scope")){
      return ["Defining a memory access != 0 with a TOP/BOTTOM_OF_PIPE stage mask. That is legal, but probably a mistake since those stages don't perform memory access."];
   }
   
   return [];
}

function is_dep_on_read(){
   let source_table = document.querySelector("#src_scope");
   let source_access_scope = get_table_access_scope(source_table);
   for (let i = 0; i < source_access_scope.length; i++) {
      if(source_access_scope[i].includes("_READ_BIT"))
         return true;
   }
   return false;
}


function get_is_exec_dependency(){
   return !does_table_do_memory_acc("#src_scope") && !does_table_do_memory_acc("#dst_scope");
}


function check_and_display_info(){
   var result_el = document.querySelector('#result');
   result_el.innerHTML = '';
   
   var error_txt = get_error_txt();
   if(error_txt.length > 0){
      let error_el = create("p", error_txt[0], "error");
      result_el.appendChild(error_el);
      
      if(error_txt.length > 1){
         for (let i = 1; i < error_txt.length; i++) {
            result_el.appendChild(error_txt[i]);
         }
      }
      return;
   }
   
   // "Creates dependency between A and B"
   result_el.appendChild(create("span", "Creates a dependency between"));
   let ul = document.createElement('ul')
   if (get_select_text('#srcSubpass') === "VK_SUBPASS_EXTERNAL")
      ul.appendChild(create("li", "Commands that occur earlier in submission order than the <code>vkCmdBeginRenderPass</code> used to begin the render pass instance and"));
   else
      ul.appendChild(create("li", "Subpass " + get_select_text("#srcSubpass") +" and"));
   
   if (get_select_text('#dstSubpass') === "VK_SUBPASS_EXTERNAL")
   ul.appendChild(create("li", "Commands that occur later in submission order than the  <code>vkCmdEndRenderPass</code> used to end the render pass instance."));
   else
   ul.appendChild(create("li", "Subpass " + get_select_text("#dstSubpass")));
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

// function example_


document.addEventListener("DOMContentLoaded", function(event) {
   document.querySelector('#srcSubpass').addEventListener("change", check_and_display_info);
   document.querySelector('#dstSubpass').addEventListener("change", check_and_display_info);
   
   // Default source and destination scopes from the spec
   let default_srcStageMasks = ["TOP_OF_PIPE_BIT"];
   let default_srcAccessMasks = [];
   let default_dstStageMask = ["ALL_COMMANDS_BIT"];
   let default_dstAccessMask = ["INPUT_ATTACHMENT_READ_BIT", "COLOR_ATTACHMENT_READ_BIT", "COLOR_ATTACHMENT_WRITE_BIT", "DEPTH_STENCIL_ATTACHMENT_READ_BIT", "DEPTH_STENCIL_ATTACHMENT_WRITE_BIT"];

   document.querySelector("#tab_src").appendChild(build_table("src_scope", default_srcStageMasks, default_srcAccessMasks));
   document.querySelector("#tab_dst").appendChild(build_table("dst_scope", default_dstStageMask, default_dstAccessMask));

   scope_checkbox_clicked();
});
