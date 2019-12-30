<template>
  <div
    v-cloak
    id="editJoomListing"
    v-loading.fullscreen.lock="fullscreenLoading"
    class="edit-page-container"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="fixed-header">
      <div class="font-18">Joom 产品编辑</div>
      <div>
        <el-button :size="size" type="primary" @click="info.saveType = 0; beforeSave()">保存</el-button>
        <el-button
          :size="size"
          type="success"
          @click="info.saveType = 1; beforeSave()"
          v-text="info.basicInfo.status === 1 ? '保存并更新到线上': '保存并刊登到线上' "
        />
      </div>
    </div>
    <div class="edit-content floor-main">
      <div class="item-info">
        <div class="item-info-content basics-info">
          <div class="product-header-img" :data-src="info.basicInfo.thumbnail">
            <el-image :src="info.basicInfo.thumbnail" class="full-width">
              <div slot="error" class="image-slot" style="line-height:120px">
                <el-tooltip class="item" effect="dark" content="图片加载失败" placement="top-start">
                  <i class="el-icon-picture-outline font-gray-color" style="font-size: 50px;" />
                </el-tooltip>
              </div>
            </el-image>
          </div>
          <div class="titles">
            <div class="en-title">
              <el-input
                v-model="info.basicInfo.title"
                placeholder="请输入产品标题"
                :size="size"
                maxlength="120"
                class="font-weight"
              />
              <span class="font-12">{{ info.basicInfo.title.length }}/120</span>
            </div>
            <div class="cn-title font-14" v-text="info.basicInfo.titleCN" />
            <div class="publish-info font-12">
              <div v-if="info.basicInfo.joomId">
                Joom ID：
                <span class="item-id">
                  <a
                    :href="'https://www.joom.com/en/products/' + info.basicInfo.joomId"
                    target="_blank"
                    v-text="info.basicInfo.joomId"
                  />
                </span>
              </div>
              <div v-else>
                Item ID：
                <span>--</span>
              </div>
              <div>
                变种数量：
                <span>{{ info.variationsInfo.length }}</span>
              </div>
              <div class="publish-status">
                <span v-if="info.basicInfo.status === 0" class="un-published">未刊登</span>
                <span v-if="info.basicInfo.status === 1" class="published">已刊登</span>
                <span v-if="info.basicInfo.status === 2" class="un-published">已结束</span>
                <span v-if="info.basicInfo.status === 3" class="un-published">已拒绝</span>
                <span v-if="info.basicInfo.status === 4" class="published">审核中</span>
              </div>
              <div>
                <div v-if="info.basicInfo.status !== 0" class="inline-block" v-html="reviewStatus" />
                <div
                  v-if="info.basicInfo.platformWarring"
                  class="font-gray-text inline-block margin-left-10 pointer"
                  @click="viewPlatformWarning"
                >查看详情</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item-info floor-item-container">
        <div class="item-info-title">
          <span>产品信息</span>
        </div>
        <div class="item-info-content product-info">
          <el-form ref="productForm" :model="info.basicInfo" :rules="rules" label-width="150px">
            <el-form-item label="系统分类：">
              <span v-text="categoryName" />
            </el-form-item>
            <el-form-item label="本地SKU：">
              <span v-text="info.basicInfo.itemCode" />
            </el-form-item>
            <el-form-item label="仓库：">
              <span v-text="info.basicInfo.warehouse" />
            </el-form-item>
            <el-form-item label="店铺：" prop="accountId">
              <el-select
                v-model="info.basicInfo.accountId"
                style="width: 250px"
                filterable
                placeholder="请选择"
                :size="size"
                :disabled="info.basicInfo.status !== 0"
              >
                <el-option
                  v-for="item in accountList"
                  :key="item.accountId"
                  :label="item.name"
                  :value="item.accountId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="产品描述：" prop="description" class="padding-top-10">
              <el-input
                v-model="info.basicInfo.description"
                type="textarea"
                :rows="6"
                :size="size"
                style="width:600px"
                maxlength="4000"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="产品标签：" class="padding-top-10" required>
              <vuedraggable
                v-model="info.basicInfo.keyWords"
                :animation="500"
                @update="datadragEnd"
                @start="startend"
              >
                <el-tag
                  v-for="tag in info.basicInfo.keyWords"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  class="move"
                  @close="handleCloseTag(tag)"
                >{{ tag }}</el-tag>
              </vuedraggable>
              <el-input
                v-if="tagInputVisible"
                v-show="info.basicInfo.keyWords.length < 10"
                ref="saveTagInput"
                v-model="tagInputValue"
                class="input-new-tag"
                size="small"
                placeholder="请输入标签"
                @keyup.enter.native="handleTagInputConfirm('keyword')"
                @keyup.188.native="handleTagInputConfirm('keyword')"
                @blur="handleTagInputConfirm('blur')"
              />
              <el-button
                v-else
                v-show="info.basicInfo.keyWords.length < 10"
                class="button-new-tag"
                size="small"
                @click="showTagInput"
              >+ 添加新标签</el-button>

              <span class="margin-left-10">{{ info.basicInfo.keyWords.length }}/10</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="item-info floor-item-container">
        <div class="item-info-title">
          <span>其他信息</span>
        </div>
        <div class="item-info-content other-info">
          <el-form ref="otherForm" :model="info.basicInfo" :rules="rules" label-width="150px">
            <el-form-item label="敏感货：" prop="dangerousKind">
              <el-select
                v-model="info.basicInfo.dangerousKind"
                filterable
                placeholder="请选择"
                :size="size"
                style="width:250px;"
              >
                <el-option
                  v-for="item in dangerousKindList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="品牌：" class="padding-top-10">
              <el-input v-model="info.basicInfo.brand" maxlength="100" :size="size" />
            </el-form-item>
            <el-form-item label="速卖通ID：">
              <el-input v-model="info.basicInfo.alternativeId" maxlength="20" :size="size" />
            </el-form-item>
            <el-form-item label="GTIN：">
              <el-input v-model="info.basicInfo.gtin" :size="size" maxlength="20" />
            </el-form-item>
            <el-form-item label="Landing Page URL：">
              <el-input v-model="info.basicInfo.landingPageUrl" :size="size" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="item-info floor-item-container">
        <div class="item-info-title">
          <span>图片信息</span>
          <strong class="margin-left-10 font-gray-text font-12">注意：Joom仅支持 550×550 以上的图片，支持拖拽排序，</strong>
          <strong class="font-danger font-12">第一张默认为主图！</strong>
        </div>
        <div class="item-info-content image-info">
          <div class="image-item">
            <div class="image-item-header">
              <div class="image-type">
                <span class="font-12 text-color">
                  图片最多选择
                  <font style="color: red;">11</font>
                  张，已经选择了 {{ info.imageInfo.length }} 张
                </span>
              </div>
              <div class="image-btns margin-top-10 margin-bottom-10">
                <el-dropdown split-button type="primary" :size="size" trigger="click">
                  添加图片
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="imgType = 'head';importItemImageVisible = true"
                    >导入Item图片</el-dropdown-item>
                    <el-upload
                      action="/JoomSalePlat/UploadImageToTemporary"
                      :show-file-list="false"
                      :data="imgUploadData"
                      :before-upload="beforeUpload"
                      :on-success="uploadSuccess"
                      :on-error="uploadError"
                      @click.native="imgType='head'"
                    >
                      <el-dropdown-item>添加本地图片</el-dropdown-item>
                    </el-upload>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="image-item-content">
              <div class="clearfix">
                <vuedraggable
                  v-model="info.imageInfo"
                  :animation="500"
                  @update="datadragEnd"
                  @start="startend"
                >
                  <transition-group>
                    <div
                      v-for="(item, index) in info.imageInfo"
                      :key="item.id"
                      v-loading="item.loading"
                      :class="index === 0 ? 'drag-item mainImg': 'drag-item otherImg'"
                    >
                      <el-image
                        :src="item.bigImgUrl"
                        :preview-src-list="[item.bigImgUrl]"
                        @load="loadingHandle(item, $event)"
                        @error="loadingHandle(item, $event)"
                      />
                      <div class="operateBtn">
                        <i
                          class="el-icon-delete pointer"
                          @click="singleDelete(info.imageInfo, index, 'img')"
                        />
                      </div>
                      <div
                        v-show="item.width && item.height"
                        class="imageSizeInfo"
                      >{{ item.width }} &times; {{ item.height }}</div>
                    </div>
                  </transition-group>
                </vuedraggable>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item-info floor-item-container">
        <div class="item-info-title">
          <span>变种信息</span>
        </div>
        <div class="item-info-content variant-info">
          <el-row class="margin-bottom-10">
            <el-col :span="19">
              <el-button
                v-if="info.basicInfo.status === 0"
                :size="size"
                @click="batRemoveVariat"
              >批量删除</el-button>
              <el-checkbox v-model="showSize" class="filter-item" style="margin-left:15px;">显示重量尺寸</el-checkbox>
              <el-checkbox v-model="showHsCode" class="filter-item" style="margin-left:15px;">显示报关信息</el-checkbox>
              <el-checkbox v-model="showGTIN" class="filter-item" style="margin-left:15px;">显示GTIN</el-checkbox>
            </el-col>
            <el-col :span="5" class="text-right">
              <el-button
                v-if="info.basicInfo.status === 0"
                :size="size"
                type="primary"
                @click="importSkuOrSpuVisible = true"
              >导入SPU/SKU</el-button>
              <!-- <el-button :size="size" v-on:click="test">测试使用</el-button> -->
            </el-col>
          </el-row>
          <el-table
            :data="info.variationsInfo"
            class="margin-bottom-10"
            style="width: 100%"
            max-height="500"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" fixed="left" width="65" />
            <el-table-column min-width="280">
              <template slot="header">
                <span class="font-danger">*</span>SKU &times; 数量
              </template>
              <template slot-scope="scope">
                <div
                  v-for="(sku, idx) in scope.row.skuInfo"
                  :key="sku.code+idx"
                  class="flex-box margin-top-5"
                >
                  <el-input
                    v-model.trim="sku.code"
                    :disabled="scope.row.status !== 0"
                    :size="size"
                    class="width-120 margin-right-5"
                    placeholder="请输入SKU"
                    @focus="oldValue=sku.code"
                    @blur="getSkuData(sku, scope.row)"
                  />
                  <span class="font-20" style="padding-top: 2px;">&times;</span>
                  <el-input
                    v-model="sku.qty"
                    :disabled="scope.row.status !== 0"
                    :size="size"
                    class="width-50 margin-left-5"
                  />
                  <i
                    v-show="scope.row.status === 0"
                    class="el-icon-plus margin-left-5 font-18 pointer"
                    style="line-height:30px; "
                    @click="addSKU(scope.row.skuInfo)"
                  />
                  <i
                    v-show="scope.row.status === 0"
                    class="el-icon-close margin-left-5 font-18 pointer"
                    style="line-height:30px; "
                    @click="singleDelete(scope.row.skuInfo, idx, 'sku')"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="150" label="原SKU属性" prop="oldProp" />
            <el-table-column width="150" label="Color">
              <template slot-scope="scope">
                <el-autocomplete
                  v-model="scope.row.color"
                  class="inline-input"
                  style="width:120px;"
                  :debounce="300"
                  value-key="colorName"
                  popper-class="Joom-color-select"
                  :popper-append-to-body="true"
                  :size="size"
                  :fetch-suggestions="querySearch"
                >
                  <template slot-scope="{ item }">
                    <div class="auto-select-item">
                      <div
                        style="width:120px"
                        class="margin-right-10 text-ellipsis inline-block"
                      >{{ item.colorName }}</div>
                      <div class="colorHex inline-block" :style="{background: item.colorHex}" />
                    </div>
                  </template>
                </el-autocomplete>
              </template>
            </el-table-column>
            <el-table-column width="120" label="Size">
              <template slot-scope="scope">
                <el-input v-model="scope.row.size" :size="size" maxlength="50" />
              </template>
            </el-table-column>
            <el-table-column v-show="info.basicInfo.status === 0" label="变种图片" width="100">
              <template slot-scope="scope">
                <el-upload
                  class="upload-update"
                  action="/JoomSalePlat/UploadImageToTemporary"
                  :show-file-list="false"
                  :data="imgUploadData"
                  :before-upload="beforeUpload"
                  :on-success="function(res, file, fileList) { return uploadSuccess(res, file, fileList, scope.$index) }"
                  :on-error="uploadError"
                >
                  <img
                    :src="scope.row.headImage && scope.row.headImage.smallImgUrl"
                    style="width:65px; height: 65px;"
                    @mouseenter="showBigImg($event, scope.row.headImage)"
                    @mouseout="hideBigImg"
                  >
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column label="预计成本(USD)" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.isImport" :key="Math.random(10000)">
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">
                      新导入的SKU暂时无法计算预计成本，
                      <br>需要保存Listing并再次打开才能显示
                    </div>
                    <span class="font-gray-text">
                      无法计算
                      <i class="el-icon-question font-14" />
                    </span>
                  </el-tooltip>
                </div>
                <div
                  v-if="!scope.row.isImport"
                  :key="Math.random(10000)"
                >{{ toDecimal2(scope.row.listingCosts) }}</div>
              </template>
            </el-table-column>
            <el-table-column width="80">
              <template slot="header">
                <span class="font-danger">*</span>价格
                <i class="el-icon-edit pointer" @click="batEdit('price')" />
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.price"
                  :size="size"
                  @keyup.native="scope.row.price = limitInput(scope.row.price)"
                />
              </template>
            </el-table-column>
            <el-table-column width="80">
              <template slot="header">
                <span class="font-danger">*</span>运费
                <i class="el-icon-edit pointer" @click="batEdit('shipping')" />
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.shipping"
                  :size="size"
                  @keyup.native="scope.row.shipping = limitInput(scope.row.shipping)"
                />
              </template>
            </el-table-column>
            <el-table-column width="80">
              <template slot="header">
                MSRP
                <i class="el-icon-edit pointer" @click="batEdit('msrp')" />
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.msrp"
                  :size="size"
                  @keyup.native="scope.row.msrp = limitInput(scope.row.msrp)"
                />
              </template>
            </el-table-column>
            <el-table-column width="100">
              <template slot="header">
                线上库存
                <i class="el-icon-edit pointer" @click="batEdit('inventory')" />
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.inventory"
                  :size="size"
                  @keyup.native="scope.row.inventory = limitInput(scope.row.inventory, 0)"
                />
              </template>
            </el-table-column>
            <el-table-column v-if="info.basicInfo.status !== 0" width="80">
              <template slot="header">
                状态
                <i class="el-icon-edit pointer" @click="batEdit('joomEnabled')" />
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.joomEnabled" />启用
              </template>
            </el-table-column>
            <el-table-column v-if="showSize" width="110">
              <template slot="header">
                <span class="font-danger">*</span>重量(kg)
                <i class="el-icon-edit pointer" @click="batEdit('shippingWeight')" />
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.shippingWeight"
                  :size="size"
                  @keyup.native="scope.row.shippingWeight = limitInput(scope.row.shippingWeight)"
                />
              </template>
            </el-table-column>
            <el-table-column v-if="showSize" width="200">
              <template slot="header">
                包装尺寸(cm)
                <i class="el-icon-edit pointer" @click="batEdit('size')" />
              </template>
              <template slot-scope="scope">
                <el-row :gutter="5">
                  <el-col :span="8">
                    <el-input
                      v-model="scope.row.shippingLength"
                      :size="size"
                      @keyup.native="scope.row.shippingLength = limitInput(scope.row.shippingLength)"
                    />
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="scope.row.shippingWidth"
                      :size="size"
                      @keyup.native="scope.row.shippingWidth = limitInput(scope.row.shippingWidth)"
                    />
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="scope.row.shippingHeight"
                      :size="size"
                      @keyup.native="scope.row.shippingHeight = limitInput(scope.row.shippingHeight)"
                    />
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column v-if="showHsCode" width="100">
              <template slot="header">
                海关编码
                <i class="el-icon-edit pointer" @click="batEdit('hsCode')" />
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.hsCode" :size="size" />
              </template>
            </el-table-column>
            <el-table-column v-if="showHsCode" width="100">
              <template slot="header">
                报关金额
                <i class="el-icon-edit pointer" @click="batEdit('declaredValue')" />
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.declaredValue"
                  :size="size"
                  @keyup.native="scope.row.declaredValue = limitInput(scope.row.declaredValue)"
                />
              </template>
            </el-table-column>
            <el-table-column v-if="showGTIN" width="90">
              <template slot="header">GTIN</template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.gtin" maxlength="20" :size="size" />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.status === 0"
                  class="el-icon-plus margin-right-5 font-18 pointer"
                  @click="addVariat(info.variationsInfo)"
                />
                <i
                  v-if="scope.row.status === 0"
                  class="el-icon-delete margin-right-5 font-18 pointer"
                  @click="singleDelete(info.variationsInfo, scope.$index, 'variat')"
                />
                <el-dropdown :size="size" trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more font-18 pointer" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="chooseSkuImgBtn(scope.row, scope.$index)"
                    >导入SKU图片</el-dropdown-item>
                    <el-upload
                      action="/JoomSalePlat/UploadImageToTemporary"
                      :show-file-list="false"
                      :data="imgUploadData"
                      :before-upload="beforeUpload"
                      :on-success="function(res, file, fileList) { return uploadSuccess(res, file, fileList, scope.$index) }"
                      :on-error="uploadError"
                    >
                      <el-dropdown-item>从本地添加图片</el-dropdown-item>
                    </el-upload>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <div class="variat-help-container font-12">
            <label class="label style-label-yellow">注意</label>
            <span class="font-gray-text margin-left-10">颜色请务必按要求添加！双色支格式：black&white；单色请参考：</span>
            <a
              class="font-blue-text"
              href="https://docs.merchant.joom.com/product/list-of-accepted-colors"
              target="_blank"
            >JOOM官方颜色列表</a>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-cloak
      :visible.sync="importSkuOrSpuVisible"
      :close-on-click-modal="false"
      title="导入SPU/SKU"
      width="800px"
      top="10vh"
      @open="stepActive=0; needImportSkuStr=''"
    >
      <div class="import-sku-or-spu">
        <div class="step-container">
          <el-steps
            :active="stepActive"
            finish-status="success"
            align-center
            class="padding-top-10"
          >
            <el-step title="输入SKU/SPU" />
            <el-step title="确认变种图片" />
          </el-steps>
        </div>
        <div class="import-sku-content">
          <div v-if="stepActive === 0">
            <el-input
              ref="needImportSkuInput"
              v-model.trim="needImportSkuStr"
              type="textarea"
              :rows="8"
              placeholder="输入多个用英文逗号隔开，例：CA000001,CA000002"
            />
          </div>
          <div v-if="stepActive === 1">
            <div class="font-gray-text margin-bottom-10" style="overflow:hidden;">
              选择新Listing的变种图，可点击变种图片进行选取
              <el-button
                :size="size"
                class="pull-right"
                @click="agShowImportSkuVisable = true"
              >导入SPU/SKU</el-button>
            </div>
            <div class="confirm-variat-img-container">
              <el-table :data="importSkuData" stripe style="width: 100%">
                <el-table-column type="index" label="序号" width="50" />
                <el-table-column label="SKU">
                  <template slot-scope="scope">
                    <span>{{ scope.row.skuInfo && scope.row.skuInfo[0].code }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="oldProp" label="属性值" width="150" />
                <el-table-column label="变种图片" width="100">
                  <template slot-scope="scope">
                    <el-badge :value="scope.row.allHeadImages.length" class="item">
                      <img
                        :src="scope.row.headImage && scope.row.headImage.smallImgUrl"
                        width="50"
                        height="50"
                        @click="changeSkuImg(scope.row, scope.$index)"
                      >
                    </el-badge>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <i
                      class="el-icon-close pointer"
                      @click="singleDelete(importSkuData, scope.$index)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="importSkuOrSpuVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :size="size"
          @click="stepNext"
        >{{ stepActive === 1 ? '导入': '下一步' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-cloak
      :visible.sync="agShowImportSkuVisable"
      :close-on-click-modal="false"
      title="导入SPU/SKU"
      @open="needImportSkuStr = ''"
    >
      <div class="margin-bottom-10">请输入需要导入的SPU/SKU，已导入的SKU不会被替换</div>
      <el-input
        v-model.trim="needImportSkuStr"
        type="textarea"
        :rows="8"
        placeholder="输入多个用英文逗号隔开，例：CA000001,CA000002"
      />
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="agShowImportSkuVisable = false">取 消</el-button>
        <el-button type="primary" :size="size" @click="agimportSku">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-cloak
      :visible.sync="editInfo.batEditVisible"
      :close-on-click-modal="false"
      :title="editInfo.batTitle"
      width="400px"
      @open="clearBatEditInfo"
    >
      <div class="editInfo">
        <el-tabs v-if="editInfo.hasTab" v-model="editInfo.tabName">
          <el-tab-pane label="替换当前" name="replace">
            <el-row>
              <el-col :span="5" style="line-height: 32px;">替换为</el-col>
              <el-col :span="19">
                <el-input
                  v-model="editInfo.value"
                  :size="size"
                  @keyup.native="editInfo.value = limitInput(editInfo.value)"
                />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="增加或减少" name="change">
            <el-row :gutter="5">
              <el-col :span="5" style="line-height: 32px;">在当前价</el-col>
              <el-col :span="4">
                <el-select v-model="editInfo.changeType" :size="size">
                  <el-option label="+" value="increase" />
                  <el-option label="-" value="reduce" />
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="editInfo.value"
                  :size="size"
                  @keyup.native="editInfo.value = limitInput(editInfo.value)"
                />
              </el-col>
              <el-col v-if="editInfo.hasUnit" :span="4">
                <el-select v-model="editInfo.unit" :size="size">
                  <el-option label="%" value="percent" />
                  <el-option label="$" value="USD" />
                </el-select>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <div v-else>
          <div v-if="editInfo.editType === 'size'">
            <el-row :gutter="3">
              <el-col :span="5" style="line-height: 32px;">替换为</el-col>
              <el-col :span="4">
                <el-input
                  v-model="editInfo.length"
                  :size="size"
                  @keyup.native="editInfo.length = limitInput(editInfo.length)"
                />
              </el-col>
              <el-col :span="2" class="text-center" style="line-height: 32px;">&times;</el-col>
              <el-col :span="4">
                <el-input
                  v-model="editInfo.width"
                  :size="size"
                  @keyup.native="editInfo.width = limitInput(editInfo.width)"
                />
              </el-col>
              <el-col :span="2" class="text-center" style="line-height: 32px;">&times;</el-col>
              <el-col :span="4">
                <el-input
                  v-model="editInfo.height"
                  :size="size"
                  @keyup.native="editInfo.height = limitInput(editInfo.height)"
                />
              </el-col>
              <el-col :span="3" style="line-height: 32px;">cm</el-col>
            </el-row>
          </div>
          <div v-else-if="editInfo.editType === 'shippingWeight'">
            <el-row :gutter="5">
              <el-col :span="5" style="line-height: 32px;">替换为</el-col>
              <el-col :span="15">
                <el-input
                  v-model="editInfo.value"
                  :size="size"
                  @keyup.native="editInfo.value = limitInput(editInfo.value)"
                />
              </el-col>
              <el-col :span="3" style="line-height: 32px;">kg</el-col>
            </el-row>
          </div>
          <div v-else-if="editInfo.editType === 'hsCode'">
            <el-row :gutter="5">
              <el-col :span="5" style="line-height: 32px;">替换为</el-col>
              <el-col :span="18">
                <el-input v-model="editInfo.value" :size="size" />
              </el-col>
            </el-row>
          </div>
          <div v-else-if="editInfo.editType === 'joomEnabled'">
            <el-checkbox v-model="editInfo.enable" />启用
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="editInfo.batEditVisible = false">取 消</el-button>
        <el-button type="primary" :size="size" @click="editSave">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="changeSkuImgVisible" :close-on-click-modal="false" title="选择图片">
      <div class="choose-sku-img-visible" style="height: 300px;">
        <div class="choose-img-container">
          <el-radio-group v-model="imgId">
            <div class="sku-item">
              <label v-for="(img, idx) in allImgList" :key="img.id+idx" class="radio-label">
                <img class="radio-img" :src="img.smallImgUrl" alt="图片缺失">
                <el-radio :label="img.id" />
              </label>
            </div>
          </el-radio-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeSkuImgVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChangeImg">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="titleRepeatVisible"
      title="产品标题重复"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="margin-bottom-10">当前产品标题与其他listing重复，请进行修改</div>
      <el-input
        v-model="info.basicInfo.title"
        type="textarea"
        :rows="4"
        maxlength="120"
        show-word-limit
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="titleRepeatVisible = false">取 消</el-button>
        <el-button type="primary" @click="titleRepeatVisible = false; beforeSave()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import index from './index'
export default {
  ...index
}
</script>

<style lang="scss">
/* JOOM Listing 编辑页面 start */
#editJoomListing {
  .edit-content {
    width: auto;
    padding: 0px 150px 20px 20px;
  }

  .basics-info {
    display: flex;

    .product-header-img {
      height: 100px;
      width: 100px;
      margin-right: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .titles {
      flex: 1;

      .en-title {
        display: flex;
        align-items: center;

        .el-input {
          width: 780px;
          margin-right: 15px;
        }

        span {
          color: #666;
        }
      }

      .cn-title {
        padding: 10px 0;
        line-height: 24px;
        color: #666;
      }

      .publish-info {
        display: flex;
        align-items: center;
        color: #666;

        > div {
          &:not(:last-of-type) {
            margin-right: 40px;
          }
        }

        .item-id {
          a {
            color: #4aa8f6;
          }
        }

        .publish-status {
          span {
            display: inline-block;
            height: 24px;
            line-height: 24px;
            padding: 0 10px;
            color: #fff;

            &.published {
              background-color: #5fbe9a;
            }

            &.un-published {
              background-color: #be3134;
            }
          }
        }
      }
    }
  }

  .product-info {
    .el-input__count {
      right: 25px !important;
      line-height: 16px;
    }

    .el-tag {
      margin-right: 10px;
    }

    .button-new-tag {
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }

    .input-new-tag {
      width: 200px;
      vertical-align: bottom;
    }
  }

  .other-info {
    input {
      width: 250px !important;
    }
  }

  .image-info {
    /*width: 1200px;
        margin: 0 auto;*/
    .el-dropdown {
      .el-button {
        border-radius: 0 !important;
      }
    }

    .image-item-content {
      .drag-item {
        display: inline-block;
        position: relative;
        background: #ddd;
        margin-bottom: 20px;
        float: left;
        margin-right: 10px;

        .el-image {
          display: block;
          height: 100%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        }

        &.mainImg {
          width: 300px;
          height: 300px;
        }

        &.otherImg {
          width: 140px;
          height: 140px;
        }

        &:hover {
          &.mainImg .operateBtn {
            display: block;
            top: 275px;
            transition: top 0.5s;
          }

          &.otherImg .operateBtn {
            display: block;
            top: 115px;
            transition: top 0.5s;
          }

          .imageSizeInfo {
            display: none;
            transition: display 0.5s;
          }
        }

        .imageSizeInfo {
          background: #585858;
          padding: 0 8px;
          text-align: center;
          height: 17px;
          color: #fff;
          font-size: 12px;
          border-radius: 10px;
          position: absolute;
          bottom: 5px;
          right: 5px;
        }

        .operateBtn {
          background: #585858;
          text-align: center;
          width: 100%;
          color: #fff;
          line-height: 23px;
          font-size: 16px;
          position: absolute;
          top: 100%;
          bottom: 0;
          right: 0;
        }
      }
    }
  }

  // 导入SKU/SPU弹框
  .import-sku-or-spu {
    .step-container {
      width: 100%;
      height: 75px;
      background: #f2f2f2;
      margin-bottom: 20px;
    }

    .import-sku-content {
      .confirm-variat-img-container {
        height: 280px;
        overflow-x: hidden;
        overflow-y: auto;

        .item {
          margin-top: 10px;
          margin-right: 40px;
        }
      }
    }
  }
}
/* JOOM Listing 编辑页面 end */
</style>
